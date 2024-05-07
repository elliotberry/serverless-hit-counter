import fs from 'fs';

function calculateViewBox(svgPath) {
    // Parse the SVG path data to extract commands and coordinates
    const commands = svgPath.match(/[a-df-z][^a-df-z]*/gi) || [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // Iterate through the commands to find the bounding box
    commands.forEach(command => {
        const coords = command.trim().split(/\s+/);
        const cmd = coords.shift(); // Extract the command
        coords.forEach((coord, index) => {
            if (index % 2 === 0) { // X coordinate
                const x = parseFloat(coord);
                if (!isNaN(x)) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                }
            } else { // Y coordinate
                const y = parseFloat(coord);
                if (!isNaN(y)) {
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            }
        });
    });

    // Calculate width and height of the bounding box
    const width = maxX - minX;
    const height = maxY - minY;

    // Construct viewBox attribute value
    const viewBox = `${minX} ${minY} ${width} ${height}`;

    return viewBox;
}
export default calculateViewBox;