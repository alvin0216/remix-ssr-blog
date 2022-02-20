import fs from 'fs';
import path from 'path';
import YAML from 'yamljs';

const config = fs.readFileSync(path.resolve(__dirname, '../../config.yml'), 'utf8');

fs.writeFileSync(path.resolve(__dirname, '../config.json'), JSON.stringify(YAML.parse(config)));

console.log('config.json has been seeded. 🌱');
