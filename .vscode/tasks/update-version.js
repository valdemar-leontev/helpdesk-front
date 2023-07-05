const { readFile, writeFile } = require('node:fs/promises');

const updateVersionAsync = async (filePath, searchPattern, now, framing) => {
  const fileContent = await readFile(filePath, 'utf-8');
  let strBuff = '';
  const lines = fileContent.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (line.includes(searchPattern)) {
      line = `${line.slice(0, line.indexOf(':'))}: ${framing}${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}${framing},`;
    }
    strBuff = strBuff + line + (index + 1 < lines.length ? '\r\n' : '');
  });

  await writeFile(filePath, strBuff);
};

(async function () {
  const now = new Date();

  await Promise.all([
    updateVersionAsync('package.json', '"version": ', now, '"'),
    updateVersionAsync('src//constants//app-constants.ts', 'version: ', now, '\'')
  ]);
})();