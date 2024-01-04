const generateCompositKey = (payload) => {
  const compositeKey = `${payload?.keyFor}-${payload?.firstField?.substring(
    0,
    5
  )}-${payload?.secondField.trim() ? payload?.secondField.trim() : null}`;
  return compositeKey;
};

exports.compositeKeyGenerator = {
  generateCompositKey,
};
