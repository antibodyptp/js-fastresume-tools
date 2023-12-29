/** Database columns for each resumedata entry */
export interface TorrentDbRow {
  /** Database row id */
  id: number;
  /** Torrent id (infohash string) */
  torrent_id: string;
  queue_position: number;
  name?: string;
  category: string;
  tags: string | null;
  /** qB save directory */
  target_save_path: string;
  download_path?: string;
  content_layout: string;
  ratio_limit: number;
  seeding_time_limit: number;
  inactive_seeding_time_limit: number;
  has_outer_pieces_priority: 0 | 1;
  has_seed_status: 0 | 1;
  operating_mode: string;
  stopped: 0 | 1;
  stop_condition: string;
  /**
   * Bencoded resume data blob
   *
   * Equivalent to .fastresume file minus qB-specific keys
   */
  libtorrent_resume_data: Buffer;
  /**
   * Bencoded torrent metadata blob
   *
   * Equivalent to .torrent files in BT_BACKUP folder
   */
  metadata: Buffer;
}

/** Columns used for updating save paths */
export interface PathRows {
  /** Database id */
  id: TorrentDbRow['id'];
  /** qB target_save_path column string */
  target_save_path: TorrentDbRow['target_save_path'];
  /** libtorrent_resume_data column string */
  libtorrent_resume_data: TorrentDbRow['libtorrent_resume_data'];
}

/** Libtorrent resume data column */
export interface LibDataRows {
  /** Database id */
  id: TorrentDbRow['id'];
  /** libtorrent_resume_data column string */
  libtorrent_resume_data: TorrentDbRow['libtorrent_resume_data'];
}

/** bencoded libtorrent resume data */
export interface BencodedResumeData {
  active_time: number;
  added_time: number;
  allocation: Uint8Array;
  apply_ip_filter: 0 | 1;
  auto_managed: 0 | 1;
  completed_time: number;
  disable_dht: 0 | 1;
  disable_lsd: 0 | 1;
  disable_pex: 0 | 1;
  download_rate_limit: number;
  'file-format': Uint8Array;
  'file-version': number;
  file_priority: number[];
  finished_time: number;
  httpseeds: number[];
  i2p: number;
  'info-hash': Uint8Array;
  'info-hash2': Uint8Array;
  last_download: number;
  last_seen_complete: number;
  last_upload: number;
  'libtorrent-version': Uint8Array;
  max_connections: number;
  max_uploads: 4;
  name: Uint8Array;
  num_complete: number;
  num_downloaded: number;
  num_incomplete: number;
  paused: 0 | 1;
  peers: Uint8Array;
  peers6: Uint8Array;
  pieces: Uint8Array;
  save_path: Uint8Array;
  seed_mode: number;
  seeding_time: number;
  sequential_download: 0 | 1;
  share_mode: number;
  stop_when_ready: number;
  super_seeding: number;
  total_downloaded: number;
  total_uploaded: number;
  trackers: Uint8Array[][];
  upload_mode: number;
  upload_rate_limit: number;
  'url-list': string[];
}
