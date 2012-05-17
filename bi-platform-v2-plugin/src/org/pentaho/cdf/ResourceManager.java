package org.pentaho.cdf;

import org.pentaho.platform.api.engine.IPluginResourceLoader;
import org.pentaho.platform.engine.core.system.PentahoSystem;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.HashSet;

/**
 * User: pedro
 * Date: Dec 22, 2009
 * Time: 4:55:59 PM
 */
public class ResourceManager {


  public static ResourceManager instance;

  public static final String PLUGIN_DIR = PentahoSystem.getApplicationContext().getSolutionPath("system/" + CdfContentGenerator.PLUGIN_NAME + "/");
  private static final HashSet<String> CACHEABLE_EXTENSIONS = new HashSet<String>();
  private static final HashMap<String, String> cacheContainer = new HashMap<String, String>();

  private boolean isCacheEnabled = true;

  public ResourceManager() {

    CACHEABLE_EXTENSIONS.add("html");
    CACHEABLE_EXTENSIONS.add("json");
    CACHEABLE_EXTENSIONS.add("cdfde");

    final IPluginResourceLoader resLoader = PentahoSystem.get(IPluginResourceLoader.class, null);
    this.isCacheEnabled = Boolean.parseBoolean(resLoader.getPluginSetting(this.getClass(), "pentaho-cdf-dd/enable-cache"));

    //

  }


  public static ResourceManager getInstance() {

    if (instance == null) {
      instance = new ResourceManager();
    }

    return instance;
  }

  public String getResourceAsString(final String path, final HashMap<String, String> tokens) throws IOException {

    final String extension = getResourceExtension(path);

    final String cacheKey = buildCacheKey(path, tokens);


    // If it's cachable and we have it, return it.
    if (isCacheEnabled && CACHEABLE_EXTENSIONS.contains(extension) && cacheContainer.containsKey(cacheKey)) {

      // return from cache. Make sure we return a clone of the original object
      return cacheContainer.get(cacheKey);

    }

    // Read file
    final InputStream in = new FileInputStream(PLUGIN_DIR + path);
    final StringBuilder resource = new StringBuilder();
    int c;
    while ((c = in.read()) != -1) {
      resource.append((char) c);
    }
    in.close();

    // Make replacement of tokens
    if (tokens != null) {

      for (final String key : tokens.keySet()) {
        final int index = resource.indexOf(key);
        if (index != -1) {
          resource.replace(index, index + key.length(), tokens.get(key));
        }
      }

    }


    final String output = resource.toString();

    // We have the resource. Should we cache it?
    if (isCacheEnabled && CACHEABLE_EXTENSIONS.contains(extension)) {
      cacheContainer.put(cacheKey, output);
    }

    return output;

  }


  public String getResourceAsString(final String path) throws IOException {

    return getResourceAsString(path, null);

  }


  private String buildCacheKey(final String path, final HashMap<String, String> tokens) {

    final StringBuilder keyBuilder = new StringBuilder(path);

    if (tokens != null) {
      for (final String key : tokens.keySet()) {
        keyBuilder.append(key.hashCode());
        keyBuilder.append(tokens.get(key).hashCode());
      }
    }

    return keyBuilder.toString();
  }


  private String getResourceExtension(final String path) {

    return path.substring(path.lastIndexOf('.') + 1);

  }

  public void cleanCache() {
    cacheContainer.clear();
  }

}
