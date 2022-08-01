/**
 * rename
 * @description A node utility script for batch renaming.
 * @author tylerseabury@protonmail.com
 * 
 * @example node ./rename.js --pattern ./example/*.{jpg,png} --prefix '2022'
 */

const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );
const gradient = require( 'gradient-string' );
const minimist = require( 'minimist' );

// Format the flag args
const ARGS = minimist( process.argv.slice( 2 ) );

// Ensure propers args given.
if ( !ARGS.pattern ) {
  log( 'Error!', ['--pattern is a required flag!'] );
  process.exit( 9 );
}
if ( !ARGS.prefix ) {
  log( 'Error!', ['--prefix is a required flag!'] );
  process.exit( 9 );
}

const PATTERN = ARGS.pattern;
const PREFIX = ARGS.prefix;

const workingPath = PATTERN.split( '*' )?.[0] || '';
console.log( workingPath, PATTERN );
const WD = path.resolve( workingPath );
const localPath = p => path.resolve( path.join( WD, p ) );

const DIRNAME = 'renamed';
const DIRPATH = localPath( DIRNAME );

// Create the directory structure, while ensuring it does not already exist.
if ( !fs.existsSync( DIRPATH ) ) {
  fs.mkdirSync( DIRPATH );
}

const files = glob.sync( PATTERN );

let n = 1;
for ( const file of files ) {
  fs.copyFileSync(
    file,
    path.join( DIRPATH, `${PREFIX}-${n++}${path.extname( file )}` )
  );
}

// Great success!
log( 'Great success!', [`Files have been copied and renamed!\n\nHave a blessed day!`] );
process.exit( 0 );



//
// './blocks/*/src/index.js'
// should become:
// /^(\.\/blocks\/([\w\d-]+))\/src\/index\.js$/g
function convertGlobSearchToRegex ( searchString ) {
  searchString = searchString.replace( '.', '\\.' );
  searchString = searchString.replace( '/', '\\/' );
  searchString = searchString.replace( '*', '([\\w\\d-_]+))' );
  searchString = '^(' + searchString + '$';
  return new RegExp( searchString, 'g' );
}

function getPathParts ( path, searchString ) {
  const matches = convertGlobSearchToRegex( searchString ).exec( path );
  if ( !exists( matches ) || !exists( matches[1] ) || !exists( matches[2] ) ) return false;
  return matches;
}

function toTitleCase ( str ) {
  const firstLetterOfWord = /(?:^|\s)(\w)/gm;
  let match = null;
  while ( match = firstLetterOfWord.exec( str ) ) {
    if ( match && match[1] ) {
      // If capture group 1 exists
      let idx = match.index;
      idx += match[0].indexOf( match[1] ); // The actual index of the letter.

      // Split the string in preparation to repalce the letter.
      const left = str.slice( 0, idx );
      const letter = str.slice( idx, idx + 1 ).toUpperCase(); // Convert to capital case.
      const right = str.slice( idx + 1 );

      // Recombine
      str = left + letter + right;

      // Reset
      match = null;
    }
  }
  return str;
}

function toSnakeCase ( str ) {
  return toTitleCase( str ).replaceAll( /[\s\W]/gm, '' );
}

function toKebabCase ( str ) {
  return str.replaceAll( /[\s\W]/gm, '-' );
}

function exists ( variable ) {
  if ( null === variable || undefined === variable ) return false;
  return true;
}

function log ( msg, extra = [] ) {
  console.log(
    gradient.rainbow.multiline(
      [
        msg,
        '\n',
        ...extra
      ].join()
    )
  );
}