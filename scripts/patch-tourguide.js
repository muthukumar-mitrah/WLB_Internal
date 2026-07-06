const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const svgMaskPath = path.join(rootDir, 'node_modules', 'rn-tourguide', 'lib', 'components', 'SvgMask.js');
const connectedStepPath = path.join(rootDir, 'node_modules', 'rn-tourguide', 'lib', 'components', 'ConnectedStep.js');

function patchSvgMask() {
  if (!fs.existsSync(svgMaskPath)) {
    console.warn(`[Patch Warning] SvgMask.js not found at: ${svgMaskPath}`);
    return;
  }

  let content = fs.readFileSync(svgMaskPath, 'utf8');

  // Check if already patched
  if (content.includes('componentDidMount()')) {
    console.log('[Patch Info] SvgMask.js is already patched.');
    return;
  }

  // Insert componentDidMount right before componentDidUpdate
  const searchStr = 'componentDidUpdate(prevProps) {';
  const replaceStr = 'componentDidMount() {\n        this.animate();\n    }\n    componentDidUpdate(prevProps) {';

  if (!content.includes(searchStr)) {
    console.error('[Patch Error] Could not find insertion point in SvgMask.js');
    return;
  }

  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(svgMaskPath, content, 'utf8');
  console.log('[Patch Success] SvgMask.js patched successfully.');
}

function patchConnectedStep() {
  if (!fs.existsSync(connectedStepPath)) {
    console.warn(`[Patch Warning] ConnectedStep.js not found at: ${connectedStepPath}`);
    return;
  }

  let content = fs.readFileSync(connectedStepPath, 'utf8');

  // Check if already patched
  if (content.includes('if (width === 0 || height === 0)')) {
    console.log('[Patch Info] ConnectedStep.js is already patched.');
    return;
  }

  // Replace measure() logic to retry on zero width/height layout
  const targetStr = `this.wrapper.measure((_ox, _oy, width, height, x, y) => resolve({
                        x: borderRadius ? x + borderRadius : x,
                        y,
                        width: borderRadius ? width - borderRadius * 2 : width,
                        height,
                    }), reject);`;

  const replacementStr = `this.wrapper.measure((_ox, _oy, width, height, x, y) => {
                        if (width === 0 || height === 0) {
                            requestAnimationFrame(measure);
                        } else {
                            resolve({
                                x: borderRadius ? x + borderRadius : x,
                                y,
                                width: borderRadius ? width - borderRadius * 2 : width,
                                height,
                            });
                        }
                    }, reject);`;

  if (!content.includes(targetStr)) {
    console.error('[Patch Error] Could not find measure resolution in ConnectedStep.js');
    return;
  }

  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(connectedStepPath, content, 'utf8');
  console.log('[Patch Success] ConnectedStep.js patched successfully.');
}

console.log('[Patch Start] Patching rn-tourguide...');
patchSvgMask();
patchConnectedStep();
console.log('[Patch End] Done.');
