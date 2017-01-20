var assert = require('assert'),
    metalsmithCodeHighlight = require('./index');

var files = {
  'bogus.jpg': {
    contents: new Buffer('<pre><code class=lang-js>// Hi</code></pre>')
  },
  'escape.html': {
    contents: new Buffer('<pre><code class=lang-js>true && false</code></pre>')
  },
  'code.html': {
    contents: new Buffer('<pre><code class=lang-js>// Hi</code></pre>')
  },
  'double.html': {
    contents: new Buffer(
      '<p>Hello there.</p>' +
      '<p>Inline <code class=lang-js>document.all</code></p>' +
      '<pre><code class=lang-coffeescript>' +
      '\nrequire "fs"\nconsole.log fs.readFileSync "/etc/passwd"' +
      '</code></pre>'
    )
  },
  'doctype.html': {
    contents: new Buffer(
      '<!DOCTYPE html>' +
      '<html>' +
      '<head><title>Test Page</title></head>' +
      '<body><pre><code class=lang-js>var x = [1, 2, 3];</code></pre></body>' +
      '</html>'
    )
  }
}

var plugin = metalsmithCodeHighlight();

plugin(files, {}, function(err) {
  assert.equal(
    files['code.html'].contents.toString(),
    '<pre><code class="lang-js hljs"><span class="hljs-comment">// Hi</span></code></pre>'
  );

  assert.equal(
    files['escape.html'].contents.toString(),
    '<pre><code class="lang-js hljs"><span class="hljs-literal">true</span> &amp;&amp; ' +
    '<span class="hljs-literal">false</span></code></pre>'
  );

  assert.equal(
    files['double.html'].contents.toString(),
    ('<p>Hello there.</p><p>Inline <code class="lang-js">document.all</code></p>' +
    '<pre><code class="lang-coffeescript hljs">\n' +
    '<span class="hljs-built_in">require</span> ' +
    '<span class="hljs-string">"fs"</span>\n' +
    '<span class="hljs-built_in">console</span>.log fs.readFileSync ' +
    '<span class="hljs-string">"/etc/passwd"</span></code></pre>')
  );

  assert.equal(
    files['doctype.html'].contents.toString(),
    ('<!DOCTYPE html>\n' +
    '<html><head><title>Test Page</title></head><body><pre>' +
    '<code class="lang-js hljs"><span class="hljs-keyword">var</span> ' +
    'x = [<span class="hljs-number">1</span>, <span class="hljs-number">' +
    '2</span>, <span class="hljs-number">3</span>];</code></pre></body></html>')
  );


  // Don't touch non-HTML files
  assert.equal(
    files['bogus.jpg'].contents.toString(),
    '<pre><code class=lang-js>// Hi</code></pre>'
  );

  console.log("All tests passed");
});
