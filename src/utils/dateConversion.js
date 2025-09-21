function convertToTraditionalMongolian(date) {
  const mongolianNumerals = {
    '0': '᠐',
    '1': '᠑',
    '2': '᠒',
    '3': '᠓',
    '4': '᠔',
    '5': '᠕',
    '6': '᠖',
    '7': '᠗',
    '8': '᠘',
    '9': '᠙',
    '-': '᠂',
  };

  return date
    .split('')
    .map(char => mongolianNumerals[char] || char)
    .join('');
}

export { convertToTraditionalMongolian };