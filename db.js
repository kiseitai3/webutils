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

import {log} from './console_utils';
const sqlite3 = require('sqlite3').verbose();

/*API container*/
export class DB{
    /*ctor and dtor*/
    DB()
    {
    }
    
    /*methods*/
    open(name, ramfs=true)
    {
    if(ramfs)
    {
        this.db = new sqlite3.Database(':memory:', db_err);
    }
    else
    {
        this.db = new sqlite3.Database(name, db_err);
    }
    return db;
}

   query(query, params='')
   {
       this.dataReady = false;
       db.each(query, params,  this.db_callback_getRow, this.db_callback_Completed);
   }

   close()
   {
       this.db.close();
   }


/*Callback functions and error handling*/
   db_callback_getRow(err, row)
   {
       if(err)
       {
           db_err(err);
       }

       if(row)
       {
           this.cursor.push(row);
       }
   }

   db_callback_Completed(err, rows)
   {
       if(err)
       {
           db_err(err);
       }

       this.rowCount = rows;
       this.dataReady = true;
   }

   db_err(err)
   {
       Log(err.message, 2);
   }
    /*variables*/
    db = 0;
    rowCount = 0;
    dataReady = false;
    cursor = [];
}
/*API functions*/
