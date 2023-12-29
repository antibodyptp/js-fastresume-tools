import Database, { type Database as DbType } from 'better-sqlite3';
import fs from 'node:fs';

import type { LibDataRows, PathRows } from '../types/index.js';

/**
 * Creates a timestamped backup of the database file
 * @param databasePath file path for database
 */
export const backupDatabase = (databasePath: string) => {
  try {
    fs.copyFileSync(databasePath, `${databasePath}.bak-${Date.now()}`);
  } catch (error) {
    throw new Error(`Could not find database at ${databasePath}`, error!);
  }
};

/**
 * Opens the database file
 * @param databasePath path to the database
 * @returns SQLite3 database connection
 */
export const database = (databasePath: string) => {
  return new Database(databasePath, { fileMustExist: true });
};

/**
 * Returns rows where resumedata contains string
 * @param db database connection
 * @param query string to query
 * @returns rows containing query string
 */
export const queryResumeData = (db: DbType, query: string) => {
  // qB stores libtorrent_resume_data as a blob
  const stringAsHex = Buffer.from(query).toString('hex').toUpperCase();

  const rows = db
    .prepare(
      `
    SELECT id,libtorrent_resume_data
    FROM torrents
    WHERE hex(libtorrent_resume_data) LIKE '%${stringAsHex}%'
    ;`,
    )
    .all() as LibDataRows[];

  return rows;
};

/**
 * Returns rows where save path contains string
 * @param db database connection
 * @param query string to query
 * @returns rows containing query string
 */
export const querySavePath = (db: DbType, query: string) => {
  // qB only stores target_save_path with '/' path separator regardless of OS,
  // so we have to convert if it contains '\'
  const cleanString = query.replace('\\', '/');

  const rows = db
    .prepare(
      `
    SELECT id,target_save_path,libtorrent_resume_data
    FROM torrents
    WHERE target_save_path LIKE '%${cleanString}%'
    ;`,
    )
    .all() as PathRows[];

  return rows;
};

/**
 * Saves database rows with updated libtorrent_resume_data
 * @param db database connection
 * @param resumeDataValue new libtorrent_resume_data blob
 * @param rowId target database row
 */
export const updateResumeData = (
  db: DbType,
  resumeDataValue: Buffer,
  rowId: number,
) => {
  db.prepare(
    `
    UPDATE torrents
    SET libtorrent_resume_data=($data)
    WHERE id=$id
    ;`,
  ).run({ data: resumeDataValue, id: rowId });
};

/**
 * Update save path values
 *
 * The save path is stored in two places, target_save_path and in the libtorrent_resume_data blob
 * @param db database connection
 * @param savePathValue new target_save_path string
 * @param resumeDataValue new libtorrent_resume_data blob
 * @param rowId target database row
 */
export const updateSavePath = (
  db: DbType,
  savePathValue: string,
  resumeDataValue: Buffer,
  rowId: number,
) => {
  db.prepare(
    `
    UPDATE torrents
    SET target_save_path=($path), libtorrent_resume_data=($data)
    WHERE id=$id
    ;`,
  ).run({ path: savePathValue, data: resumeDataValue, id: rowId });
};
