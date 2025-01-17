/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2029-07-20
 ******************************************************************************/


define(function() {

  // Shared/Static stuff

  // Allows creating multiple instances
  function FactoryHolder(container, factory, scope) {
    var instance;

    if(!scope) { scope = 'instance'; }

    this.build = function(config, buildNew) {
      if(instance && !buildNew) { return instance; }

      var inst = factory(container, config);

      if(!buildNew && scope === 'singleton') { instance = inst; }

      return inst;
    };

    this.dispose = function() {
      if(instance) {
        doDispose(instance);
        instance = null;
      }
    };
  }

  function InstanceHolder(container, instance, scope) {
    if(!scope) { scope = 'external'; }

    this.build = function(/*config, buildNew*/) { return instance; };

    // external scope is managed outside the container
    this.dispose = function() {
      if(instance) {
        scope === 'singleton' && doDispose(instance);
        instance = null;
      }
    };
  }

  function doDispose(instance) {
    if(typeof instance.dispose === 'function') { instance.dispose(); }
  }

  var hasOwn = Object.prototype.hasOwnProperty;

  function isOwnEmpty(o) {
    // tolerates o == null
    for(var n in o) { if(hasOwn.call(o, n)) { return false; } }
    return true;
  }

  /**
   * @class  cdf.dashboard.Container
   * @amd  cdf/dashboard/Container
   * @classdesc Generic container class for registering and fetching objects
   *            according to a key, using a factory pattern.
   *            Used for add-ins and queries, this is mostly an internal use
   *            only module and should not appear by now in the documentation.
   * @ignore
   */
  return /** @lends cdf.dashboard.Container */ function() {

    // PUBLIC

    // register(type, what [, scope])
    // register(type, name, what [, scope])
    this.register = function(type, name, what, scope) {
      if(!type) { throw new Error("Argument 'type' is required."); }
      if(typeof type !== 'string') { throw new Error("Argument 'type' must be a string."); }

      if(name != null) {
        if(typeof name !== 'string') {
          scope = what;
          what  = name;
          name  = null;
        } else if(!name) {
          name = null;
        }
      }

      if(!what) { throw new Error("Argument 'what' is required."); }

      var holder;
      switch(typeof what) {
        case 'function': holder = new FactoryHolder (this, what, scope); break;
        case 'object':   holder = new InstanceHolder(this, what, scope); break;
        default: throw new Error("Argument 'what' is of an invalid type.");
      }

      if(!name) { name = ''; }

      var holdersByName = _typesTable[type] || (_typesTable[type] = {});
      var currHolder = holdersByName[name];
      if(currHolder) {
        // throw? log?
        currHolder.dispose();
      }
      holdersByName[name] = holder;
    };

    this.has    = function(type, name) { return !!getHolder(type, name, true); };
    this.canNew = function(type, name) { return getHolder(type, name, false) instanceof FactoryHolder; };

    this.get       = function(type, name)         { return get(type, name, null,   false, false); };
    this.tryGet    = function(type, name)         { return get(type, name, null,   false, true ); };

    this.getNew    = function(type, name, config) { return get(type, name, config, true,  false); };
    this.tryGetNew = function(type, name, config) { return get(type, name, config, true,  true ); };

    this.getAll    = function(type) { return getAll(type, false); };
    this.tryGetAll = function(type) { return getAll(type, true ); };

    this.listType = function(type) { return getType(type,false); };
    this.tryListType = function(type) { return getType(type,true); };

    this.dispose = function() {
      if(_typesTable) {
        for(var type in _typesTable) {
          var holdersByName = _typesTable[type];
          for(var name in holdersByName) {
            holdersByName[name].dispose();
          }
        }

        _typesTable = null;
      }
    };

    // PRIVATE

    var _typesTable = {}; // type -> []

    function getType(type, isTry) {
      if(!type) { throw new Error("Argument 'type' is required."); }
      if(typeof type !== 'string') { throw new Error("Argument 'type' must be a string."); }

      var holdersByName = _typesTable[type];
      if(!isTry && (!holdersByName || isOwnEmpty(holdersByName))) {
        throw new Error("There are no registrations for type '" + type + "'.");
      }
      return holdersByName;
    }

    function getHolder(type, name, isTry) {
      var holder;
      var holdersByName = getType(type, isTry);
      if(holdersByName) {
        holder = holdersByName[name || ''];
        if(!holder && !isTry) {
          throw new Error("There is no registration for type '" + type + "'" +
            (name ? (" and name '" + name + "'") : "") + ".");
        }
      }

      return holder;
    }

    function get(type, name, config, isNew, isTry) {
      if(typeof name !== 'string') {
        config = name;
        name = '';
      }

      var holder = getHolder(type, name, isTry);

      // Can't store as singletons instances with special config params
      if(config) {
        isNew = true;
      } else if(!isNew) {
        config = {};
      }

      return holder ? holder.build(config, isNew) : null;
    }

    function getAll(type, isTry) {
      var holdersByName = getType(type, isTry);

      // Includes the default (unnamed) instance
      var instances = [];
      for(var name in holdersByName) {
        instances.push(holdersByName[name].build({}, false));
      }
      return instances;
    }
  };
});
