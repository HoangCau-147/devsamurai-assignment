/**
* Capitalizes the first letter of each word in the input string.
*
* @param {string} str - The input string to be capitalized.
* @returns {string} - The capitalized string.
*/
function capitalizeWords(str: string): string {
  if (!str) return str;

  return str
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' '); 
}

export default capitalizeWords;