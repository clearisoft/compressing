'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const uuid = require('uuid');
const pipe = require('multipipe');
const compressible = require('../..');
const assert = require('power-assert');

describe('test/gzip/file_stream.test.js', () => {
  it('should be a transform stream', done => {
    const sourceFile = path.join(__dirname, '..', 'fixtures', 'xx.log');
    const sourceStream = fs.createReadStream(sourceFile);
    const destFile = path.join(os.tmpdir(), uuid.v4() + '.log.gz');
    console.log('destFile', destFile);
    const gzipStream = new compressible.gzip.FileStream();
    const destStream = fs.createWriteStream(destFile);
    pipe(sourceStream, gzipStream, destStream, err => {
      assert(!err);
      assert(fs.existsSync(destFile));
      done();
    });
  });

  it('should compress according to file path', done => {
    const sourceFile = path.join(__dirname, '..', 'fixtures', 'xx.log');
    const destFile = path.join(os.tmpdir(), uuid.v4() + '.log.gz');
    console.log('destFile', destFile);
    const gzipStream = new compressible.gzip.FileStream({ source: sourceFile });
    const destStream = fs.createWriteStream(destFile);
    pipe(gzipStream, destStream, err => {
      assert(!err);
      assert(fs.existsSync(destFile));
      done();
    });
  });

  it('should compress buffer', done => {
    const sourceFile = path.join(__dirname, '..', 'fixtures', 'xx.log');
    const sourceBuffer = fs.readFileSync(sourceFile);
    const destFile = path.join(os.tmpdir(), uuid.v4() + '.log.gz');
    console.log('destFile', destFile);
    const destStream = fs.createWriteStream(destFile);
    const gzipStream = new compressible.gzip.FileStream({ source: sourceBuffer });
    pipe(gzipStream, destStream, err => {
      assert(!err);
      assert(fs.existsSync(destFile));
      done();
    });

  });

  it('should compress stream', done => {
    const sourceFile = path.join(__dirname, '..', 'fixtures', 'xx.log');
    const sourceStream = fs.createReadStream(sourceFile);
    const destFile = path.join(os.tmpdir(), uuid.v4() + '.log.gz');
    console.log('destFile', destFile);
    const destStream = fs.createWriteStream(destFile);
    const gzipStream = new compressible.gzip.FileStream({ source: sourceStream });
    pipe(gzipStream, destStream, err => {
      assert(!err);
      assert(fs.existsSync(destFile));
      done();
    });
  });

  it('should emit error if sourceFile does not exit', done => {
    const sourceFile = 'file-not-exist';
    const gzipStream = new compressible.gzip.FileStream({ source: sourceFile });
    gzipStream.on('error', err => {
      assert(err);
      done();
    });
  });

  it('should emit error if sourceStream emit error', done => {
    const sourceFile = 'file-not-exist';
    const sourceStream = fs.createReadStream(sourceFile);
    const gzipStream = new compressible.gzip.FileStream({ source: sourceStream });
    gzipStream.on('error', err => {
      assert(err && err.code === 'ENOENT');
      done();
    });
  });

});