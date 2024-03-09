export function translateNames(message: string): string {
  let translatedNames: string[] = [];

  Object.keys(data).forEach(name => {
    const regex = new RegExp(name, 'i');
    if (regex.test(message)) {
      translatedNames.push(name);
    }
  });

  return translatedNames.map(name => `${name} = ${data[name]}`).join('\n');
}
