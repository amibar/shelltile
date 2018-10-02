const Meta = imports.gi.Meta;
const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Lang = imports.lang;
const Clutter = imports.gi.Clutter;
const Tweener = imports.ui.tweener;
const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const Log = Extension.imports.logger.Logger.getLogger("ShellTile");
const Window = Extension.imports.window.Window;
const Gdk = imports.gi.Gdk

const HookSpots = function(ext){

    this.extension = ext;
    this.log = Log.getLogger("HookSpots");
    
	this.hooksInitialized = false;
	this.hooksVisible = false;
	this.hooksMonitor = null;

	this.leftHook = null;
	this.rightHook = null;

	this.topHook = null;
	this.bottomHook = null;
    this.allHooks = [];
    
    this.initHooks = function() {

        let topHook = {
            label: new St.Label({ style_class: 'hook-label', text: "Top" }),
            postion: {x: 0, y:0 },
            hit_rect: null,
            preview_rect: null,
            update_position: function(monitor_rect) { 
                let x = monitor_rect.x + Math.floor(monitor_rect.width / 2 - this.label.width / 2);
                let y = monitor_rect.y + Math.floor(monitor_rect.height / 4 - this.label.height / 2)

                this.postion.x = x;
                this.postion.y = y;
                this.hit_rect = new Meta.Rectangle({ x: x, y: y, width: this.label.width, height: this.label.height});

                this.preview_rect = new Meta.Rectangle({ x: monitor_rect.x, y: monitor_rect.y, width: monitor_rect.width, height: monitor_rect.height / 2});
            }
        };

        let bottomHook = {
            label: new St.Label({ style_class: 'hook-label', text: "Bottom" }),
            postion: {x: 0, y:0 },
            hit_rect: null,
            preview_rect: null,
            update_position: function(monitor_rect) { 
                let x = monitor_rect.x + Math.floor(monitor_rect.width / 2 - this.label.width / 2);
                let y = monitor_rect.y + Math.floor(monitor_rect.height * 3 / 4 - this.label.height / 2)

                this.postion.x = x;
                this.postion.y = y;
                this.hit_rect = new Meta.Rectangle({ x: x, y: y, width: this.label.width, height: this.label.height});

                this.preview_rect = new Meta.Rectangle({ x: monitor_rect.x, y: monitor_rect.y + monitor_rect.height / 2, width: monitor_rect.width, height: monitor_rect.height / 2});
            }
        };

        let leftHook = {
            label: new St.Label({ style_class: 'hook-label', text: "Left" }),
            postion: {x: 0, y:0 },
            hit_rect: null,
            preview_rect: null,
            update_position: function(monitor_rect) { 
                let x = monitor_rect.x + Math.floor(monitor_rect.width / 4 - this.label.width / 2);
                let y = monitor_rect.y + Math.floor(monitor_rect.height / 2 - this.label.height / 2)

                this.postion.x = x;
                this.postion.y = y;
                this.hit_rect = new Meta.Rectangle({ x: x, y: y, width: this.label.width, height: this.label.height});

                this.preview_rect = new Meta.Rectangle({ x: monitor_rect.x, y: monitor_rect.y, width: monitor_rect.width /2, height: monitor_rect.height });
            }
        };

        let rightHook = {
            label: new St.Label({ style_class: 'hook-label', text: "Right" }),
            postion: {x: 0, y:0 },
            hit_rect: null,
            preview_rect: null,
            update_position: function(monitor_rect) { 
                let x = monitor_rect.x + Math.floor(monitor_rect.width *3 / 4 - this.label.width / 2);
                let y = monitor_rect.y + Math.floor(monitor_rect.height / 2 - this.label.height / 2)

                this.postion.x = x;
                this.postion.y = y;
                this.hit_rect = new Meta.Rectangle({ x: x, y: y, width: this.label.width, height: this.label.height});

                this.preview_rect = new Meta.Rectangle({ x: monitor_rect.x + monitor_rect.width / 2, y: monitor_rect.y, width: monitor_rect.width / 2, height: monitor_rect.height });
            }
        };

        let fullHook = {
            label: new St.Label({ style_class: 'hook-label', text: "Full" }),
            postion: {x: 0, y:0 },
            hit_rect: null,
            preview_rect: null,
            update_position: function(monitor_rect) { 
                let x = monitor_rect.x + Math.floor(monitor_rect.width / 2 - this.label.width / 2);
                let y = monitor_rect.y + Math.floor(monitor_rect.height / 2 - this.label.height / 2)

                this.postion.x = x;
                this.postion.y = y;
                this.hit_rect = new Meta.Rectangle({ x: x, y: y, width: this.label.width, height: this.label.height});

                this.preview_rect = new Meta.Rectangle({ x: monitor_rect.x, y: monitor_rect.y, width: monitor_rect.width, height: monitor_rect.height});
            }
        };


        this.allHooks.push(topHook);
        this.allHooks.push(bottomHook);
        this.allHooks.push(leftHook);
        this.allHooks.push(rightHook);
        this.allHooks.push(fullHook);

        //this.rightHook = new St.Label({ style_class: 'hook-label', text: "Right" });
        //this.topHook = new St.Label({ style_class: 'hook-label', text: "Top" });
        //this.bottomHook = new St.Label({ style_class: 'hook-label', text: "Bottom" });

    }


    this.showHooks = function(win) {

		if (!this.hooksInitialized){
            this.initHooks();
            this.hooksInitialized = true;
        }

		if(!this.hooksVisible){

			for (let i = 0; i < this.allHooks.length; i++){
				Main.uiGroup.add_actor(this.allHooks[i].label);
				this.allHooks[i].opacity = 255;
			}
			this.hooksVisible = true;
		}

		let monitor_rect =  win.get_maximized_bounds();
		//if(this.log.is_debug()) this.log.debug("monitor: " + monitor_rect);

		if (this.monitor_rect != monitor_rect){

            this.monitor_rect = monitor_rect;
            
            for (let i = 0; i < this.allHooks.length; i++){
                let currentHook = this.allHooks[i];
                currentHook.update_position(monitor_rect);
                currentHook.label.set_position(currentHook.postion.x, currentHook.postion.y);    
			}            

			// this.leftHook.set_position(
			// 	monitor.x + Math.floor(monitor.width / 4 - this.leftHook.width / 2),
			// 	monitor.y + Math.floor(monitor.height / 2 - this.leftHook.height / 2));

			// this.rightHook.set_position(
			// 	monitor.x + Math.floor(monitor.width * 3 / 4 - this.rightHook.width / 2),
			// 	monitor.y + Math.floor(monitor.height / 2 - this.rightHook.height / 2));

			// this.topHook.set_position(
			// 	monitor.x + Math.floor(monitor.width / 2 - this.topHook.width / 2),
			// 	monitor.y + Math.floor(monitor.height / 4 - this.topHook.height / 2));

			// this.bottomHook.set_position(
			// 	monitor.x + Math.floor(monitor.width / 2 - this.bottomHook.width / 2),
			// 	monitor.y + Math.floor(monitor.height * 3 / 4 - this.bottomHook.height / 2));			
		}
    }

    this.hideHooks = function(){
		for (let i = 0; i < this.allHooks.length; i++){
			Main.uiGroup.remove_actor(this.allHooks[i].label);
		}
		this.hooksVisible = false;
		this.hooksMonitor = null;
    }

	this.get_cursor_rect = function(){
		let [mouseX, mouseY] = global.get_pointer();
		return new Meta.Rectangle({ x: mouseX, y: mouseY, width: 1, height: 1});
	}

    this.hitTest = function(cursor){
        if (!this.hooksVisible){
            return null;
        }

        var cursor_rect = this.get_cursor_rect();
        var preview_rect = null; 
        
        for (let i = 0; i < this.allHooks.length; i++){
            if (this.allHooks[i].hit_rect.contains_rect(cursor_rect))
            {
                preview_rect = this.allHooks[i].preview_rect;
            }
        }
    
        return preview_rect;
    }    
};
