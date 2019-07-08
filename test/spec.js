const assert = require('assert');

const fs = require('fs');
const os = require('os');
const assertPathExists = p => fs.existsSync(p);

const Tempper = require('../lib/main.js');

describe('Tempper', () => {

    describe('constructor', () => {

        it('Should create a directory in the system temp folder', () => {
            let t = new Tempper();
            assert(fs.existsSync(t.dir));
            process.chdir(__dirname);
            fs.rmdirSync(t.dir);
        });

        it('Should change to the newly created directory', () => {
            let t = new Tempper();
            assert.strictEqual(process.cwd(), t.dir);
            process.chdir(__dirname);
            fs.rmdirSync(t.dir);
        });

        it('Should store the old directory name', () => {
            let od = process.cwd();
            let t = new Tempper();
            assert.strictEqual(od, t.oldDir);
            process.chdir(__dirname);
            fs.rmdirSync(t.dir);
        });

    });

    describe('::clear', () => {

        it('Should create a directory in the system temp folder', () => {
            let t = new Tempper();
            let d = t.dir;
            t.clear();
            assert(!t.dir);
            assert(!fs.existsSync(d));
            t.clear();
        });

    });

    describe('::addFile', () => {

        it('Should copy the file from old location to new one', () => {
            process.chdir('./res');
            let t = new Tempper();
            t.addFile('file.txt', './file.txt');
            assert(fs.existsSync(t.dir + '/file.txt'));
            assert.strictEqual(fs.readFileSync(t.dir + '/file.txt', 'utf8'), 'foobar\r\n');
            t.clear();
        });

        it('Should fail when temp not started', () => {
            let t = new Tempper();
            t.clear();
            assert.throws( () => t.addFile('file.txt', './file.txt'), /not started/);
        });

    });

    describe('::mkdir', () => {

        it('Should create an empty dir inside the tmp dir', () => {
            let t = new Tempper();
            t.mkdir('my-test');
            assert(fs.existsSync(t.dir + '/my-test'));
            t.clear();
        });

    });

    describe('::refresh', () => {

        it('Should return you a new clean tmp dir', () => {
            let t = new Tempper();
            t.addFile('file.txt', './file.txt');

            t.refresh();
            assert(!fs.existsSync(t.dir + '/file.txt'));
            t.clear();
        });

    });

});
