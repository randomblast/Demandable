/**
 * @fileoverview
 * @author Josh Channings <josh@channings.me.uk>
 *
 * Node.js implementation of Demandable.js, the on-demand javascript loader
 */

var util = require('util');

var Demandable = function(args)
{
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
    try
    {
      var fs = require('fs');
      if(this._args.sync)
        return fs.readFileSync(this._args.file, 'utf8');
      else
        fs.readFile(this._args.file, 'utf8', cb);
    }
    catch(err)
    {
      console.log("Couldn't load " + this._fn + " from " + this._file);
      throw(err);
    }
  }

  return this.exec;
}

try {exports.Demandable = Demandable;} catch(err) {} // CommonJS
