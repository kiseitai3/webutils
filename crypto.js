/* 
 * Copyright (C) 2019 Luis M. Santos.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */

import {webutil_StrToBuff, webutil_BuffToStr} from './common'
import {log} from './console_utils'
const crypto = require('crypto');
const uuid = require('uuid/v4');
var date = new Date();

export class KeyPacket
{
    publicKey = 0;
    expiration = 0;
    expir_rate = 0;
}

export class KeyPair
{
    publicKey = 0;
    privateKey = 0;
}

export class CryptoToolBox
{
    /*variables*/
    keyPair = new KeyPair();
    expiration = 0;
    expir_rate = 0;
    
    /*ctor and dtor*/
    CryptoToolBox()
    {
    }
    
    /*methods*/
    generateKey()
    {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096});
        this.keyPair.publicKey = publicKey;
        this.keyPair.privateKey = privateKey;
    }
    
    encrypt(msg)
    {
        var input = this.encode(msg);
        return this.encode(webutil_BuffToStr(
                crypto.privateEncrypt(
                this.keyPair.privateKey, webutil_StrToBuff(input))));
    }
    
    decrypt(msg)
    {
        var input = this.decode(msg);
        return this.decode(webutil_BuffToStr(
                crypto.publicDecrypt(
                this.keyPair.publicKey, webutil_StrToBuff(input))));
    }
    
    encode(msg)
    {
        return btoa(msg) + '';
    }
    
    decode(msg)
    {
        return atob(msg) + '';
    }
    
    setPubKey(keyPacket)
    {
        this.keyPair.publicKey = keyPacket.publicKey;
        this.expiration = keyPacket.expiration;
        this.expir_rate = keyPacket.expir_rate;
    }
    
    getPubKey()
    {
        var keyP = new KeyPacket();
        keyP.publicKey = this.keyPair.publicKey;
        keyP.expiration = this.expiration;
        keyP.expir_rate = this.expir_rate;
        return keyP;
    }
    
    generateExpiration(expir_constant = 0)
    {
        if(expir_constant !== 0)
        {
            this.expir_rate = expir_constant;
        }
        this.expiration = this.expir_rate + date.getTime();
    }
    
    refreshKey(expir_constant = 0)
    {
        clearKey();
        generateKey();
        generateExpiration(expir_constant);
    }
    
    clearKey()
    {
        this.keyPair.publicKey = 0;
        this.keyPair.privateKey = 0;
    }
    
    is_expired()
    {
        return this.expiration >= date.getTime();
    }
}


/*KeyStore classes. This is the piece that will deal with storing, sorting, and
 * searching for keys. Use this to store public keys.
 */

class KeyItem
{
    guid = 0
    guid_raw = '';
    publicKey = 0;
    prevLink = 0;
    nextLink = 0;
}

export class KeyStore
{
    /*variables*/
    root = 0;
    
    
    /*methods*/
    GetGUID(key)
    {
        return this._getItemByKey(this.root, key).guid_raw;
    }
    
    GetKey(guid)
    {
        var id = webutil_GUIDToNum(guid);
        return this._getItemByID(root, id);
    }
    
    Insert(key)
    {
        this.InsertWithGUID(key, this.GenerateUniqueGUID());
    }
    
    InsertWithGUID(key, guid)
    {
        var itm = new KeyItem();
        
        itm.guid = webutil_GUIDToNum(guid);
        itm.guid_raw = guid;
        itm.publicKey = key;
        
        if(this._insertItem(root, itm))
            log("Successfully added item: " + itm.guid_raw);
        else
            log("Error adding item: " + itm.guid_raw + " With Root: " + root);
    }
    
    GenerateGUID()
    {
        return uuid();
    }
    
    GenerateUniqueGUID()
    {
        var guid = this.GenerateGUID();
        while(this._itemExists(this.root, webutil_GUIDToNum(guid)))
        {
            guid = this.GenerateGUID();
        }
        return guid;
    }
    
    _getItemByID(root, id)
    {
        if(root === 0)
            return new KeyItem();
        
        if(root.guid == id)
            return root;
        
        if(id > root.guid)
            return this._getItemByID(root.nextLink, id);
        return this._getItemByID(root.prevLink, id);
    }
    
    _getItemByKey(root, key)
    {
        var itm = 0;
        if(root === 0)
            return new KeyItem();
        
        if(root.key == key)
            return root;
        
        itm = this._getItemByID(root.nextLink, key);
        if(itm.guid != 0)
            return itm;
        return this._getItemByID(root.prevLink, key);
    }
    
    _insertItem(root, itm)
    {
        //Null Case
        if(root == 0)
            return root = itm;
        
        if(itm.guid > root.guid)
            if(root.nextLink != 0)
                return this._getItemByID(root.nextLink, itm);
            return root.nextLink = itm;
        
        if(itm.guid < root.guid)
            if(root.prevLink != 0)
                this._getItemByID(root.prevLink, itm);
            return root.prevLink = itm;
    }
    
    _itemExists(root, guid)
    {
        if(root == 0)
            return false;
        
        if(root.guid_raw != guid)
            root = this._getItemByID(webutil_GUIDToNum(guid));
        
        if(root.guid_raw === '')
            return false;
        return true;
    }
}

export function webutil_GUIDToNum(guid)
{
    var hasher = crypto.createHash('sha256');
    var hash = 0;
    var result = 0;
    hasher.update(guid);
    hash = hasher.digest();
    for(var i = 0; i < hash.length; i++)
    {
        result += hash[i];
    }
    return result;
}