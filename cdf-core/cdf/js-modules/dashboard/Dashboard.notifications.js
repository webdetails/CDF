/*!
 * Copyright 2002 - 2014 Webdetails, a Pentaho company.  All rights reserved.
 *
 * This software was developed by Webdetails and is provided under the terms
 * of the Mozilla Public License, Version 2.0, or any later version. You may not use
 * this file except in compliance with the license. If you need a copy of the license,
 * please go to  http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
 * the license for the specific language governing your rights and limitations.
 */


define(['./Dashboard', './Popups','../Logger', 'amd!../lib/underscore', '../lib/jquery', 'amd!../lib/jquery.blockUI'],
  function(Dashboard, Popups, Logger, _, $) {

  /**
   * A module representing an extension to Dashboard module for notifications.
   * @module Dashboard.notifications
   */
  Dashboard.implement({
  
    /**
     * Inits the notification module
     *
     * @method   _initNotifications
     * @private
     * @for Dashboard
     */
    _initNotifications: function() {
      this.ERROR_CODES = {
        'QUERY_TIMEOUT' : {
          msg: "Query timeout reached"
        },
        "COMPONENT_ERROR" : {
          msg: "Error processing component"
        }
      };
    },
  
    /**
     *
     */
    blockUIwithDrag: function() {
      if(typeof this.i18nSupport !== "undefined" && this.i18nSupport != null) {
        // If i18n support is enabled process the message accordingly
        // but we're just setting the same img
        $.blockUI.defaults.message = '<div class="img blockUIDefaultImg" style="padding: 0px;"></div>';
      }
  
      $.blockUI();
      var handle = $('<div id="blockUIDragHandle"></div>')
      $("div.blockUI.blockMsg").prepend(handle);
      $("div.blockUI.blockMsg").draggable({
        handle: "#blockUIDragHandle"
      });
    },
  
    /**
     *
     */
    showProgressIndicator: function() {
      $.blockUI && this.blockUIwithDrag();
    },
  
    /**
     *
     */
    hideProgressIndicator: function(force) {
      if(force) {
        this.resetRunningCalls();
      }
      $.unblockUI && $.unblockUI();
      this.showErrorTooltip();// Dashboards.Legacy
    },
  
  
    /**
     *
     * @param errorCode
     * @returns {*|{}}
     */
    getErrorObj: function (errorCode){
      return this.ERROR_CODES[errorCode] || {};
    },
  
    /**
     *
     * @param resp
     * @param txtStatus
     * @param error
     * @returns {{}}
     */
    parseServerError: function(resp, txtStatus, error){
      var out = {};
      var regexs = [
        { match: /Query timeout/ , msg: Dashboard.getErrorObj('QUERY_TIMEOUT').msg  }
      ];
  
      out.error = error;
      out.msg = Dashboard.getErrorObj('COMPONENT_ERROR').msg;
      var str = $('<div/>').html(resp.responseText).find('h1').text();
      _.find( regexs, function (el){
        if(str.match(el.match)){
          out.msg = el.msg ;
          return true
        } else {
          return false
        }
      });
      out.errorStatus = txtStatus;
  
      return out
    },
  
    /**
     *
     */
    handleServerError: function() {
      var err = Dashboard.parseServerError.apply( this, arguments );
  
      Dashboard.errorNotification( err );
      Dashboard.trigger('cdf cdf:serverError', this);
      Dashboard.resetRunningCalls();
    },
  
    /**
     *
     * @param err
     * @param ph
     */
    errorNotification: function (err, ph) {
      if(ph) {
        Popups.notificationsComponent.render(
            $(ph), {
              title: err.msg,
              desc: ""
            });
      } else {
        Popups.notificationsGrowl.render({
          title: err.msg,
          desc: ''
        });
      }
    },
  
    /**
     * Default impl when not logged in
     */
    loginAlert: function(newOpts) {
      var opts = {
        header: "Warning",
        desc: "You are no longer logged in or the connection to the server timed out",
        button: "Click to reload this page",
        callback: function(){
          window.location.reload(true);
        }
      };
      opts = _.extend( {} , opts, newOpts );
  
      Popups.okPopup.show(opts);
      this.trigger('cdf cdf:loginError', this);
    },
  
    /**
     *
     */
    checkServer: function() {
      //check if is connecting to server ok
      //use post to avoid cache
      var retVal = false;
      $.ajax({
        type: 'POST',
        async: false,
        dataType: 'json',
        //url: wd.cdf.endpoints.getPing(),
        success: function(result) {
          if(result && result.ping == 'ok') {
            retVal = true;
          }
          else {
            retVal = false;
          }
        },
        error: function() {
          retVal = false;
        }
  
      });
      return retVal;
    }
  
  });
    
});
