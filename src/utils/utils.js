const pluralRules = new Intl.PluralRules('en-US');

const irregularPlurals = {
  reply: 'replies',
};

export const getPluralForm = (count, word) => {
  const pluralCategory = pluralRules.select(count);
  if (count === 0 || pluralCategory === 'other') {
    const plural = irregularPlurals[word] || `${word}s`;
    return `${count} ${plural}`;
  } else if (count === 1) {
    return `1 ${word}`;
  } else {
    const plural = irregularPlurals[word] || `${word}s`;
    return `${count} ${plural}`;
  }
};

export const abbreviateNumber = (value) => {
  value = Math.round(value);
  if(value === 0) return 0;
  const SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];
  const tier = Math.floor(Math.log10(Math.abs(value)) / 3);
  if (tier === 0) return value.toString();
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;
  let formatted = Math.floor(scaled.toFixed());

  if (Math.abs(parseFloat(formatted)) >= 1000 && tier < SI_SYMBOL.length - 1) {
    return (value < 0 ? '-1' : '1') + SI_SYMBOL[tier + 1];
  }
  return formatted + suffix;
};
