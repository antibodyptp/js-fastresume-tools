import { Command } from '@commander-js/extra-typings';
import bencode from 'bencode';
import chalk from 'chalk';
import figlet from 'figlet';
import ora from 'ora';

import {
  backupDatabase,
  database,
  queryResumeData,
  querySavePath,
  updateResumeData,
  updateSavePath,
} from './lib/db.js';
import { replaceString, replaceByteString } from './lib/utils.js';

import type { BencodedResumeData } from './types/index.js';

const mainColor = '#b172d5';

const main = () => {
  const program = new Command()
    .option(
      '-f, --database-file <value>',
      'path to database file',
      './torrents.db',
    )
    .option('--disable-backup', 'disables automatic backup creation', false)
    .option(
      '--existing-path <value>',
      'existing path or path segment to replace',
    )
    .option(
      '--new-path <value>',
      'new path or path segment to replace existing one',
    )
    .option(
      '--existing-tracker <value>',
      'existing tracker or URL segment to replace',
    )
    .option(
      '--new-tracker <value>',
      'new tracker or URL segment to replace existing one',
    )
    .parse(process.argv);

  // eslint-disable-next-line no-console
  console.log(
    chalk.hex(mainColor).bold(figlet.textSync('qB fastresume tools')),
    '\n',
    '\n',
  );

  const {
    databaseFile,
    disableBackup,
    existingPath,
    newPath,
    existingTracker,
    newTracker,
  } = program.opts();

  // Throw errors on missing arguments
  if (existingPath && !newPath) {
    throw new Error('Missing --new-path argument');
  } else if (newPath && !existingPath) {
    throw new Error('Missing --existing-path argument');
  }

  if (existingTracker && !newTracker) {
    throw new Error('Missing --new-tracker argument');
  } else if (newTracker && !existingTracker) {
    throw new Error('Missing -existing-tracker argument');
  }

  // Make a backup of the torrents.db file
  if (!disableBackup) {
    const backupSpinner = ora(
      chalk.hex(mainColor).italic('Backing up db\n'),
    ).start();
    backupDatabase(databaseFile);
    backupSpinner.succeed();
  }

  // Load the database
  const loadSpinner = ora(chalk.hex(mainColor).italic('Loading db\n')).start();
  const db = database(databaseFile);
  loadSpinner.succeed();

  // Replace paths
  if (existingPath && newPath) {
    let updatedRowCount = 0;
    const spinner = ora(
      chalk.hex(mainColor).italic('Updating save paths...\n'),
    ).start();

    const rows = querySavePath(db, existingPath);
    for (const row of rows) {
      // Update "target_save_path" column
      const qBTargetSavePath = replaceString(
        row.target_save_path,
        existingPath,
        newPath,
      );

      // Update "libtorrent_resume_data" blob
      // We don't cast to utf8 here because that breaks 'pieces' field
      const bencodedData = bencode.decode(
        row.libtorrent_resume_data,
      ) as BencodedResumeData;

      bencodedData.save_path = replaceByteString(
        bencodedData.save_path,
        existingPath,
        newPath,
      );

      const libtorrentResumeData = bencode.encode(bencodedData);

      updateSavePath(db, qBTargetSavePath, libtorrentResumeData, row.id);

      updatedRowCount += 1;
    }

    spinner.succeed(
      chalk
        .hex(mainColor)
        .bold(
          `Path update: ${chalk.green(updatedRowCount)} database ${
            updatedRowCount === 1 ? 'row' : 'rows'
          } updated\n`,
        ),
    );
  }

  // Replace trackers
  if (existingTracker && newTracker) {
    let updatedRowCount = 0;
    const spinner = ora(
      chalk.hex(mainColor).italic('Updating trackers...\n'),
    ).start();

    const rows = queryResumeData(db, existingTracker);
    for (const row of rows) {
      // Update "libtorrent_resume_data" blob
      // We don't cast to utf8 here because that breaks 'pieces' field
      const bencodedData = bencode.decode(
        row.libtorrent_resume_data,
      ) as BencodedResumeData;

      bencodedData.trackers = bencodedData.trackers.map((trackerListItem) => {
        return [
          replaceByteString(trackerListItem[0], existingTracker, newTracker),
        ];
      });

      const libtorrentResumeData = bencode.encode(bencodedData);

      updateResumeData(db, libtorrentResumeData, row.id);

      updatedRowCount += 1;
    }

    spinner.succeed(
      chalk
        .hex(mainColor)
        .bold(
          `Tracker update: ${chalk.green(updatedRowCount)} database ${
            updatedRowCount === 1 ? 'row' : 'rows'
          } updated\n`,
        ),
    );
  }

  db.close();
};

main();
