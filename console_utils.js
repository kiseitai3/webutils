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

export function log(msg, type=0, console=true)
{
    if(console)
        webutil_consoleLog(msg, type);
    webutil_docLog(msg, type);
}

function webutil_consoleLog(msg, type=0)
{
    switch(type)
    {
        case 0:
            console.write("Message: " + msg);
        case 1:
            console.write("Warning: " + msg);
        case 2:
            console.write("Error: " + msg);
        default:
            console.write("Unknown Message Type: " + msg);
    }
}

function webutil_docLog(msg, type=0)
{
    switch(type)
    {
        case 0:
            document.write("Message: " + msg);
        case 1:
            document.write("Warning: " + msg);
        case 2:
            document.write("Error: " + msg);
        default:
            document.write("Unknown Message Type: " + msg);
    }
}