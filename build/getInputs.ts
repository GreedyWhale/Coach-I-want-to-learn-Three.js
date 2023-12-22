import { readdirSync, lstatSync } from 'fs';
import { resolve, join } from 'path';

export const getInputs = () => {
  try {
    const rootPath = resolve(__dirname, '../src/pages');
    const files = readdirSync(rootPath);
    const inputs = {};
    for (const file of files) {
      if (lstatSync(join(rootPath, file)).isDirectory()) {
        inputs[file] = resolve(__dirname, `../src/pages/${file}/index.html`);
      } else {
        inputs['main'] = resolve(__dirname, '../src/pages/index.html');
      }
    }

    console.log(inputs);
    return inputs;
  } catch (error) {
    console.error(error);
  }
};
