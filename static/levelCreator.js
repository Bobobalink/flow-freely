var LC = LC || {};
LC.labelStack = [];
for (var label in flowDots.Static.COLORS) {
    if (!flowDots.Static.COLORS.hasOwnProperty(label)) continue;
    LC.labelStack.push(label);
    LC.labelStack.push(label);
}

LC.labelStack.sort().reverse();

LC.onClick = function (event) {
    var mousePoint = new HT.Point(event.pageX, event.pageY);
    var hex = grid.GetHexAt(mousePoint);
    console.log(LC.labelStack);
    if (!dots[hex.Id]) {
        if(LC.labelStack.length == 0) return;
        dots[hex.Id] = new flowDots.Dot(hex, LC.labelStack.pop());
    } else {
        LC.labelStack.push(dots[hex.Id].label);
        delete dots[hex.Id];
    }
    drawThings();
};
