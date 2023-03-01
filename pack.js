const { writeFileSync } = require('fs');
const pkg = require('./package.json');

pkg.type = 'module';

writeFileSync('./lib/package.json', JSON.stringify(pkg, null, 2));
