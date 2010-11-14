/**
 * @fileoverview
 * @author Josh Channings <josh@channings.me.uk>
 *
 * Browser implementation of Demandable.js, the on-demand javascript loader
 */

var Demandable = function(args)
{
  this.base_url = '';

  var self = this;

  this._args = args;
  this._parent = arguments.callee;

  this.exec = function()
  {
    var args = arguments;

    if(undefined === self._fn)
    {
      if(self._args.sync)
      {
        self._fn = eval(self.load());
        self._fn = eval(self._args.name);
      }
      else
        return self.load(function(err, data)
        {
          if(err) throw(err);
          eval(data);
          self._fn = eval(self._args.name);
          self._fn.apply(self._parent, args);
        });
    }
    
    try {return self._fn.apply(self._parent, args);}
    catch(err) {throw(new Error("Couldn't load function '" + self._args.name + "' from '" + self._args.file + "'"));}
  }

  this.load = function(cb)
  {
    try // XMLHttpRequest
    {
      xhr = new XMLHttpRequest();
      xhr.open('GET', self.base_url + self._args.file, !self._args.sync);

      if(!self._args.sync)
        xhr.onreadystatechange = function(e)
        {
          if(xhr.readyState == 4)
          {
            if(xhr.status == 200)
              cb(null, xhr.responseText);
            else
              cb(xhr.statusText)
          }
        }

      xhr.send(null);

      if(self._args.sync)
        return xhr.responseText;
    }
    catch(err)
    {
      console.log("Couldn't load " + this._fn + " from " + this._file);
      throw(err);
    }
  }

  return this.exec;
}
