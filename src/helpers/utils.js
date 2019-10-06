import { CRYPTOBJ } from "../shared/config/constants.js";

// Check for browser support for sessionStorage and crypto.getRandomValues
export function isBrowserSupported() {
  if (
    typeof Storage === "undefined" ||
    CRYPTOBJ === undefined ||
    CRYPTOBJ.getRandomValues === "undefined"
  ) {
    return false;
  } else {
    return true;
  }
}

// REDUX FUNCTIONS =======================
export function createStringConstants(...constants) {
  return constants.reduce((acc, constant) => {
    const obj = acc;

    if (typeof constant !== "string")
      throw new Error(
        `arguments passed to utils.createStringConstants() must be strings - ${constant} is a ${typeof constant}`
      );

    obj[constant] = constant;
    return obj;
  }, {});
}

// General helper functions
export function getNameFromD3Email(email) {
  // create user display name from signinName
  const indexAt = email.indexOf("@");
  return email.substring(0, indexAt).replace(".", " ");
}

// Get proper response to display from error object returned
export function getErrorMsg(errorObj) {
  if (typeof errorObj.response != "undefined") {
    return errorObj.response.data;
  } else {
    return errorObj.message;
  }
}

// projects: array
export function getProjectsForDropdown(projects) {
  return projects.map(proj => ({ text: proj.name, value: proj.name }));
}

export function getTicketsForDropdown(tickets) {
  return tickets.map(ticket => ({ text: ticket.name, value: ticket.name }));
}

// Provided the video and canvas elements, return a thumbnail image as a base64 encoded string
export function getThumbnailUrl(videoElement, canvas) {
  canvas.width = 320;
  canvas.height = 200;
  canvas
    .getContext("2d")
    .drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL();
}

// Functions to managing strings for document name inputs
const unsafeCharactersList = [
  '"',
  "<",
  ">",
  "#",
  "%",
  "{",
  "}",
  "|",
  "\\",
  "^",
  "~",
  "[",
  "]",
  "`",
  ";",
  "/",
  "?",
  ":",
  "@",
  "=",
  "&"
];

const unwantedCharactersList = ["-", "+", "'"];

const allowedCharacters = ["$", "_", ".", "!", "*", "(", ")"];

export function allowedCharsMsg() {
  let msg = "These special characters can be used:";
  allowedCharacters.forEach(function(char) {
    msg += ` ${char}`;
  });
  return msg;
}

export const nameCheck = {
  isAllowed: isNameAllowed,
  errorMsg: "Name not allowed",
  isOnlyWhitespace: isOnlyWhitespace
};

function isNameAllowed(name) {
  return (
    isOnlyWhitespace(name) ||
    hasUnsafeCharacters(name) ||
    hasUnwantedCharacters(name)
  );
}

function isOnlyWhitespace(string) {
  return string.replace(/\s/g, "").length == 0;
}

function hasUnsafeCharacters(string) {
  for (let i = 0; i < unsafeCharactersList.length; i++) {
    if (string.includes(unsafeCharactersList[i])) return true;
  }
  return false;
}

function hasUnwantedCharacters(string) {
  for (let i = 0; i < unwantedCharactersList.length; i++) {
    if (string.includes(unwantedCharactersList[i])) return true;
  }
  return false;
}

// Functions to managing strings for url
// Replace spaces with -
export function encodeUrlComponent(name) {
  return encodeURIComponent(encodeSpaces(name));
}

export function decodeUrlComponent(name) {
  return decodeURIComponent(decodeSpaces(name));
}

function encodeSpaces(name) {
  return name.replace(new RegExp(" ", "g"), "-");
}

function decodeSpaces(name) {
  return name.replace(/[-]/g, " ");
}

// Get the window location pathname without a trailing slash
export const getPath = () => {
  let path = window.location.pathname;
  if (path[path.length - 1] == "/") {
    path = path.slice(0, -1);
  }
  return path;
};

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
