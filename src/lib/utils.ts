/**
 * Find and replace in string, with separator replacement
 *
 * Note: will always replace '\\' with '/'
 * @param target target string
 * @param oldString old string to replace
 * @param newString new string to replace old
 * @returns updated string
 * @example replacing paths
 * ```js
 * const target = "D:\\Downloads\\movies\\720p";
 * const oldPath = "D:\\Downloads\\movies";
 * const newPath = "E:\\Movies";
 *
 * const result = replaceString(target, oldPath, newPath);
 * // result => "E:/Movies/720p"
 * ```
 * @example replacing trackers
 * ```js
 * const target = "http://tracker-one.com/announce";
 * const oldTracker = "http://tracker-one.com";
 * const newTracker = "https://tracker-one.com:8000";
 *
 * const result = replaceString(target, oldTracker, newTracker);
 * // result => "E:/Movies/720p"
 * ```
 */
export const replaceString = (
  target: string,
  oldString: string,
  newString: string,
) => {
  // qB will save a mix of '/' and '\\' path separators, so we need to find and replace both styles
  // We only save '/' as a separator
  const oldStringConverted = oldString.replace('\\', '/');
  const newStringConverted = newString.replace('\\', '/');

  return target
    .replace(oldString, newStringConverted) // we only use '/' for any new paths
    .replace(oldStringConverted, newStringConverted)
    .replace('\\', '/'); // convert any other path separators
};

/**
 * Find and replace folder path in byte string
 *
 * Decodes the byte string, makes the changes, and returns a re-encoded byte string
 *
 * Note: will always replace '\\' with '/'
 * @param target target byte string
 * @param oldString old string to replace
 * @param newString new string to replace old
 * @returns updated byte string
 * @example replacing paths
 * ```js
 * const target = new TextEncoder().encode("D:\\Downloads\\movies\\720p"); // Uint8Array(24) [68,  58,  92,  68, ...,]
 * const oldPath = "D:\\Downloads\\movies";
 * const newPath = "E:\\Movies";
 *
 * const result = replaceByteString(target, oldPath, newPath);
 * // result => "E:/Movies/720p" => Uint8Array(14) [69,  58,  47,  77, ...,]
 * ```
 * @example replacing trackers
 * ```js
 * const target = new TextEncoder().encode("http://tracker-one.com/announce"); // Uint8Array(31) [104, 116, 116, 112, ...,]
 * const oldTracker = "http://tracker-one.com";
 * const newTracker = "https://tracker-one.com:8000";
 *
 * const result = replaceByteString(target, oldTracker, newTracker);
 * // result => "https://tracker-one.com:8000/announce" => Uint8Array(37) [104, 116, 116, 112, ...,]
 * ```
 */
export const replaceByteString = (
  target: Uint8Array,
  oldString: string,
  newString: string,
) => {
  let path = new TextDecoder().decode(target);
  path = replaceString(path, oldString, newString);
  return new TextEncoder().encode(path);
};
