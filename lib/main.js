const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert');

function start(){
    // this => tempper
    let seed = String(new Date()) + crypto.randomBytes(16).toString();
    let dirName = 'tempper-' + crypto.createHash('sha1').update(seed).digest('hex');
    this.dir = path.resolve(os.tmpdir + '/' + dirName + '/');
    fs.mkdirSync(this.dir);
    process.chdir(this.dir);
}

function rmdirRF(dir){
    fs.readdirSync(dir).forEach(function(file){
        ent = path.resolve(dir, file);
        if(fs.lstatSync(ent).isDirectory())
            rmdirRF(ent);
        else
            fs.unlinkSync(ent);
    });
    fs.rmdirSync(dir);
}

module.exports = class Tempper{

    constructor(){
        this.oldDir = process.cwd();
        start.bind(this)();
    }

    refresh(){
        this.clear();
        start.bind(this)();
    }

    assertExists(p){
        assert(fs.existsSync(path.resolve(this.dir, p)));
    }

    assertMissing(p){
        assert(!fs.existsSync(path.resolve(this.dir, p)));
    }

    addFile(from, to){
        if(!this.dir)
            throw new Error('Tempper: Temp not started. Run ::refresh');
        fs.copyFileSync(
            path.resolve(this.oldDir, from),
            path.resolve(this.dir, to)
        );
    }

    mkdir(name){
        let dir = path.resolve(this.dir, name);
        fs.mkdirSync(dir, { recursive: true });
    }

    clear(){
        if(!this.dir)
            return;
        process.chdir(this.oldDir);
        rmdirRF(this.dir);
        this.dir = null;
    }

    rm(p){
        this.assertExists(p);
        if(fs.lstatSync(p).isDirectory())
            rmdirRF(p);
        else
            fs.unlinkSync(p);
    }

}
