/*!
 * Copyright 2002 - 2016 Webdetails, a Pentaho company. All rights reserved.
 *
 * This software was developed by Webdetails and is provided under the terms
 * of the Mozilla Public License, Version 2.0, or any later version. You may not use
 * this file except in compliance with the license. If you need a copy of the license,
 * please go to http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. Please refer to
 * the license for the specific language governing your rights and limitations.
 */

define([
  '../lib/jquery',
  './Dashboard',
  './Dashboard.ext',
  './Dashboard.context.ext'
], function($, Dashboard, DashboardExt, DashboardContextExt) {

  /**
   * @class cdf.dashboard.Dashboard.context
   * @amd cdf/dashboard/Dashboard.context
   * @classdesc A class representing an extension to the {cdf.dashboard.Dashboard}
   *            class for handling the context `object`.
   * @ignore
   */
  Dashboard.implement(/** @lends cdf.dashboard.Dashboard# */{
    /**
     * @description Method used by the dashboard constructor
     *              for initializing the context `object`.
     * @summary Initializes the context `object`.
     *
     * @private
     */
    _initContext: function() {
      if(!this.context) {
        this.context = {};
        $.extend(this.context, this.contextObj);
      }
    }
  });
});
