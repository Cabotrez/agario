function ChatMessage(sender, message) {
    this.sender = sender;
    this.message = message;
}

module.exports = ChatMessage;

ChatMessage.prototype.build = function (protocol) {
    var text = this.message;
    if (text == null) text = "";
    var name = "SERVER";
    var color = { 'r': 0x00, 'g': 0x50, 'b': 0x9B };
    if (this.sender != null) {
        name = this.sender._name;
        if (name == null || name.length == 0) {
            if (this.sender.cells.length > 0)
                name = "An unnamed cell";
            else
                name = "Spectator";
             var color = { 'r': 0x90, 'g': 0x50, 'b': 0x9B };
        }
        if (this.sender.cells.length > 0) {
            color = this.sender.cells[0].color;
        }
    }
    var UserRoleEnum = require("../enum/UserRoleEnum");
    var BinaryWriter = require("./BinaryWriter");
    var writer = new BinaryWriter();
    writer.writeUInt8(0x63);            // message id (decimal 99)

    // flags
    var flags = 0;
    if (this.sender == null)
        flags = 0x100;           // server message
    else if (this.sender.userRole == UserRoleEnum.OWNER)
        flags = 0x80;           // owner message
    else if (this.sender.userRole == UserRoleEnum.ADMIN)
        flags = 0x40;           // admin message
    else if (this.sender.userRole == UserRoleEnum.MODER)
        flags = 0x20;           // moder message
    else if (this.sender.userRole == UserRoleEnum.VIP)
        flags = 0x10;           // vip message
  
    writer.writeUInt8(flags);
    writer.writeUInt8(color.r >> 0);
    writer.writeUInt8(color.g >> 0);
    writer.writeUInt8(color.b >> 0);
    if (protocol < 6) {
        writer.writeStringZeroUnicode(name);
        writer.writeStringZeroUnicode(text);
    } else {
        writer.writeStringZeroUtf8(name);
        writer.writeStringZeroUtf8(text);
    }
    return writer.toBuffer();
};
