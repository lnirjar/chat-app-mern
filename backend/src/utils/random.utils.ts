export const generateRandomNumericString = (length: number) => {
  let result = "";
  const characters = "0123456789";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
