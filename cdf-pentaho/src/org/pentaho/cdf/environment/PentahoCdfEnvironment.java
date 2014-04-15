/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.pentaho.cdf.environment;

import java.util.Locale;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.pentaho.cdf.environment.broker.ICdfInterPluginBroker;
import org.pentaho.cdf.environment.broker.PentahoCdfInterPluginBroker;
import org.pentaho.cdf.environment.configurations.IHibernateConfigurations;
import org.pentaho.cdf.environment.configurations.PentahoHibernanteConfigurations;
import org.pentaho.cdf.environment.factory.ICdfBeanFactory;
import org.pentaho.cdf.environment.packager.ICdfHeadersProvider;
import org.pentaho.cdf.environment.paths.CdfApiPathProvider;
import org.pentaho.cdf.environment.paths.ICdfApiPathProvider;
import org.pentaho.cdf.environment.templater.ITemplater;
import org.pentaho.cdf.packager.CdfHeadersProvider;
import org.pentaho.cdf.templater.PentahoUITemplater;
import org.pentaho.platform.engine.core.system.PentahoSystem;
import org.pentaho.platform.util.messages.LocaleHelper;

import pt.webdetails.cpf.PentahoPluginEnvironment;
import pt.webdetails.cpf.Util;
import pt.webdetails.cpf.exceptions.InitializationException;
import pt.webdetails.cpf.resources.IResourceLoader;

public class PentahoCdfEnvironment extends PentahoPluginEnvironment implements ICdfEnvironment {

  protected static Log logger = LogFactory.getLog( PentahoCdfEnvironment.class );

  private final String PLUGIN_REPOSITORY_DIR = "/cdf";
  private static final String CONTENT = "content";

  private ICdfBeanFactory factory;
  private IResourceLoader resourceLoader;
  private IHibernateConfigurations pentahoHibernateConfigurations;
  private ICdfApiPathProvider cdfApipathProvider;
  private ICdfHeadersProvider cdfHeadersProvider;

  public void init( ICdfBeanFactory factory ) throws InitializationException {
    this.factory = factory;

    pentahoHibernateConfigurations = new PentahoHibernanteConfigurations();
    cdfApipathProvider = new CdfApiPathProvider( getPluginEnv().getUrlProvider() );
    cdfHeadersProvider = new CdfHeadersProvider();

    if ( factory.containsBean( IResourceLoader.class.getSimpleName() ) ) {
      resourceLoader = (IResourceLoader) factory.getBean( IResourceLoader.class.getSimpleName() );
    }

    super.init( this );
  }

  @Override
  public void refresh() {
    try {
      init( this.factory );
    } catch ( InitializationException e ) {
      logger.error( "refresh()", e );
    }
  }

  @Override
  public String getApplicationBaseUrl() {
    return PentahoSystem.getApplicationContext().getBaseUrl();
  }

  @Override
  public Locale getLocale() {
    return LocaleHelper.getLocale();
  }

  public IResourceLoader getResourceLoader() {
    return resourceLoader;
  }

  @Override
  protected String getPluginRepositoryDir() {
    // needed because differs from plugin id
    return "cdf";
  }

  @Override
  public String getApplicationBaseContentUrl() {
    return Util.joinPath( getApplicationBaseUrl(), CONTENT, getPluginId() ) + "/";
  }

  @Override
  public String getRepositoryBaseContentUrl() {
    return Util.joinPath( getApplicationBaseUrl(), CONTENT, getPluginId() ) + "/res/";// TODO:
  }

  @Override
  public PentahoPluginEnvironment getPluginEnv() {
    return PentahoPluginEnvironment.getInstance();
  }

  @Override
  public ICdfApiPathProvider getPathProvider() {
    return cdfApipathProvider;
  }

  @Override
  public IHibernateConfigurations getHibernateConfigurations() {
    return pentahoHibernateConfigurations;
  }

  @Override
  public String getSystemEncoding() {
    return LocaleHelper.getSystemEncoding();
  }

  @Override
  public ICdfHeadersProvider getCdfHeadersProvider() {
    return cdfHeadersProvider;
  }

  @Override
  public ITemplater getTemplater() {
    return PentahoUITemplater.getInstance();
  }

  @Override
  public ICdfInterPluginBroker getCdfInterPluginBroker() {
    return PentahoCdfInterPluginBroker.getInstance();
  }

  @Override
  public String getCdfPluginRepositoryDir() {
    return this.PLUGIN_REPOSITORY_DIR;
  }
}
