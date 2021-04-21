![](./img/banner_logo.gif)
# ACID

ACID is short for **A**lgorithms **C**reate **I**mage **D**ata and is a simple, general purpose video synthesizer for creating live visuals and computer generated images and animations. It works somewhat similar to an analog synthesizer with a little bit of Photoshop thrown in.

ACID features a clean graphic user interface that can be detached. ACID has built in export to PNG and JPG and can record GIFs and WEBM videos of any length straight out of the program. The render window can be detached to use ACID for live visuals.

This is how the interface looks:

![](./img/screenshot-1.jpg)

*GUI is opened in the main window*

![](./img/screenshot-2.jpg)

*GUI is undocked*

![](./img/screenshot-3.jpg)

*GUI and Render are both undocked*

![](./img/example.gif)

This is how a patch could look. There are currently no available presets but you can use the "Random Patch" function in the menu to get started. You can see 100 random patches in this video: https://www.youtube.com/watch?v=u_rGDhfu_Qk

## Installation

You can either install a build for your platform or run ACID yourself with `npm`.

To download a build for your platform head over to [acidatm.itch.io/acid](https://acidatm.itch.io/acid) and download a build there. The download is free, there is only an optional donation.


Presets can be found in the `/presets` directory or can be downloaded on *itch.io* as well.


To run ACID withen *electron.js*, install `npm` and `git` (if you don't have them installed), then open your terminal and run:

```bash
git clone https://github.com/acidatm/acid
cd acid/app/
npm install
npm start
```

## Acknowledgement

I was enspired by the works of these people:

- The ORCA sequencer by Rekka & Devine: https://hundredrabbits.itch.io/
- The works of Viznut, especially IBNIT: http://countercomplex.blogspot.com/2011/12/ibniz-hardcore-audiovisual-virtual.html
- And various stuff found on esoteric.codes: https://esoteric.codes/s

## Documentation

All values in the GUI range between 0 and 999, where 0 is the minimum value and 999 is the maximum. The GUI can be toggled either with the space bar or using the options in *Menubar > Window*. The GUI can also be opened in a second window.

The labels next to the sliders can be used to set a slider to specific value. The buttons next to the labels can be used to minimize, center, maximize or randomize the slider value. Both can be disabled from the *set* part of the GUI.

### Oscilators

An oscilator is either a cyclic transfer function or a noise based algorithm. A cyclic transfer function takes a value between 0 and infinity and returns a value between 0 and 1, the exact distribution of the values inbetween is determined by the oscilators waveform. The amount of values after which the oscilator repeats is determined by its frequency.

You can use oscilators as fixed filters by setting the *spd* parameter to 0. This will stop the oscilator from moving entirely. You can then control the exact character of the filter with the *frq*, *off* and *rot* parameters.

If you need a constant fixed value from an oscilator, you can use a *sqr* oscilator, with a *spd* of 0 and a low *frq*. You can then control the exact value using the *min* or *max* parameter.

If you need a completely random texture, create an oscilator with a medium value and apply a high *rnd* effect on it.

All oscilators have an additional "run" property, which can be set to quickly mute an oscilator. You can toggle it by clicking on "osx" (where x is the oscilator number) in the GUI. The run property behaves identical to the *off* type, but doesnt change the type of the oscilator.

#### Channels

All oscilators can send to 3 different channels independently. They send the same basic value to each channel but you can attenuate the value for each channel individually. You can do so from the *rgb* section using the inputs for *r*,*g* and *b*.

#### Cyclical oscilators

These are the available cyclical oscilators:

- **sqr** (Square) - will create a squarewave, that is either high or low, but has no inbetween states
- **pwm** (Pulse) - will create a pulse oscilator (and *Pulse Width Modulation* will be available in the near future)
- **saw** (Sawtooth) - will create a sawtooth wave, that starts high and falls to low in a linear fashion
- **tri** (Triangle) - will create a triangle wave, that switches between high and low in linear fashion
- **sin** (Sine) - will create a sine wave, that switches between high and low in non linear fashion
- **osc** (Oscilator) - will create a flexible oscilator, which can take any shape between a pure triangle over a pure sine to pure square. The pulse width can be modified, which can turn a triangle into a ramp or saw, or change the width of a squarewave. But it can also do any shape inbetween.


For each oscilator these are the important parameters:

- **typ** (Type) - will determine the type of oscilator to use
- **min** (Minimum) - sets the minimum amplitude (normally 0)
- **max** (Maximum) - sets the maximum amplitude (normally 999)
- **lpf** (Low Pass Filter) - Values above this threshold will be cut. The filter behaves relative to *min* and *max*
- **hpf** (High Pass Filter) - Values below this treshold will be cut. The filter behaves relative to *min* and *max*
- **mix** (Mixing) - The way this oscilator should be mixed with other oscilators
  - *ADD* (Additive) - Add the value to the mix
  - *SUB* (Subtractive) - Removes the value from the mix
  - *MLT* (Multiply) - Multiplies the mix with the value
  - *DIV* (Divide) - Divides the mix by the value
- **rot** (Oscilator Rotation) - Will rotate the oscilator in 2D space
- **frq** (Oscilator Frequency) - Determines the frequency of the oscilation
- **spd** (Oscilator Speed) - Determines how fast the oscilator moves through 2D space in the direction set by *rot*
- **off** (Oscilator Offset) - Will change the phase of the oscilation, which us really only useful when *speed* is at 0

The *osc* oscilator has these additional parameters:

- **cen** (Oscilator Center) - sets the high point of the oscilation relative to the wavelength. 0 means right at the start (which would make a triangle wave a saw wave), 999 means right at the end (which would make a triangle wave a ramp wave)
- **shp** (Oscilator Shape) - determines the general shape of the oscilator. It does so by fading between pure triangle wave (0), pure sine wave (499) and pure squarewave (999)

#### Noncyclical oscilators

These are the available, noncyclical oscilators:

- **plx** (Simplex Noise) - An advanced correlating noise algorithm
- **prl** (Perlin Noise) - A less advanced correlating noise algorithm
- **org** (Organic) - A noise algorithm that creates "organic" shapes like water ripples or woodgrain (it is simplex noise passed through a seeded random number generator)
- **off** (Off) - turns the oscilator off

The noncyclical oscilators use some of the  cyclical oscilator settings, however they are used somewhat different:

- **frq** (Oscilator Frequency) - Determines the frequency of the noise plane, which will feel more like its resolution or graininess maybe
- **off** (Oscilator Offset) - Will move to a fixed value on the plane of the noise

The organic oscilator also uses the two additional settings from the *osc* oscilator

- **cen** (Oscilator Center) - determines how many different steps or layers are generated
- **shp** (Oscilator Shape) - blends between quantised and unquantised noise

 There are also a couple of additional settings for the two noise algorithms, as they are 3 dimensional. The oscilator settings control the z axis, the other two axis are controlled by their respective parameters. All axis have the same set of parameters.

The noise algorithms are seedable, which means same values in, same values out. You can reseed the noise algorithms from *Menubar > Render > Reseed*.

### Effects

All oscilators can have any number of effects applied to them. Which effects are applied is set by the effects chain ("--- + " in the GUI). Clicking on "+" will add a new effect to the chain, clicking on an effect will flip through the different effect types, clicking on "---" (which will then show "clr") will clear the effect chain. Effects are passed through from left to right.

- **---** (List) - marks the presence of a list. Clicking will clear the list
- **+** (Add) - can be clicked to add new entrys to the list.

The settings for all effects in the chain are the same. However you can use the chain to apply effects in different order or multiple times. The settings are set in the *fx* part of the respective GUI section:

- **bit** (Bitreduction) - Will reduce the number of possible values down to only a single one. 0 means no reduction, 999 means maximum reduction.
- **cmp** (Compression) - Will make lower values higher while influencing higher values less.
- **exp** (Expansion) - Will make lower values even lower while influencing higher values less. Works somewhat in reverse to compression.
- **rnd** (Randomization) - Will randomly change values. A low setting will result in a more "analog" look, while a high setting will make things very glitchy
- **drv** (Drive) - Will amplify all values equally. Can be used as a preamp or overdrive.

### Render

The parameters for the render process can be found under "img". The render process determines how the values generated by ACID and the configuration set in the GUI are used to generate images. Not all settings are available at all times, some may only be visible when a certain color mode or render engine is active.

- **frm** (Framerate) - the desired framerate for the undocked render window. To not display visible jumbs between frames the render process will render frame after frame and not skip frames. This can result in exported GIFs looking faster. You can see the true FPS in the settings tab
- **res** (Resolution) - resolution for the undocked render window
- **pre**
  - **res** (Preview Resolution) - resolution for the main window
  - **frm** (Preview Framerate) - framerate for the main window
- **bw** (Black and White) - blends between color and black and white
- **brn** (Burn) - can be used to lighten the image when subpixels are enabled
- **drv** (Drivetype) - this is the clipping stage of the master amplifier, there are 3 settings available:
  - **clp** (Clip) - Will simply clip all values over 1 and make them 1
  - **mod** (Modify) - Will wrap all values over 1 until they are below 1. 1.5 would become 0.5, 2.3 would become 0.3 and so on.
  - **dyn** (Dynamic) - Will redistribute all values on a range between the frames lowest and highest value, making it impossible to clip the amp (however you can use a compressor or drive and a low pass filter to achieve the effect on an oscilator level)
- **clr** (Colormode) - Changes the colormode. You can click on the GUI label to activate a fixed HSL based color mode, which can be helpfull to see how the oscilators effect each other.
  - *rgb* (Linear RGB) - ACID can effect a linear RGB space
  - *grd* (Gradient) - ACID can effect the value on a range between any amount of  colors. The colors are determined by the values in the color list. The black and white values between 0 and 1 are used to determine the position on the gradient.
  - *ndx* (Indexed) - works just like gradient. Except its not a gradient but a stepped gradient with no mix between the steps.

#### Feedback

The virtual feedback engine simulates true feedback when using a camera that is pointed on a screen that displays the camera image. Simulates, not duplicates. It is different. But based around the same idea. As ACID is deterministic we can now the value of each pixel at any point in time. And that is exactly how the feedback works. We simply don't show all pixels at the same point in time at the same time.

- **int** (Feedback Intensity) - Intensity of the feedback, basically how far into the future we go at max
- **edg** (Feedback Quantization) - How much the feedback is quantized. This will lead to visible jumps/edges
- **x** (Feedback Center X) - relative x position of the center of the feedback
- **y** (Feedback Center Y) - relative y position of the center of the feedback
- **mix** (Feedback Mix) -  mixes between horizontal and vertical feedback
- **bnd** (Feedback Bend) - mixes between linear and feedbacked feedback (you read that right, the feedback can feedback on it self). This will lead to more bended lines then straight lines
- **skw** (Feedback Skew) - mixes between horizontal and vertical bend
- **sqr** (Feedback Squaring/Linearity) - mixes between a linear and a stepped version of the feedback. Linear look like a triangle, stepped like a square (so like classic tv feedback)
- **drk** (Feedback Darken) - makes the feedback darker the further back it is in time (like classic tv feedbacks)

### Settings

The settings part of the GUI can be found under "set". Here you can change default values, GUI styles and some global settings for the render engine.

- **fps** (True FPS) - display the true FPS
- **wid** (Width) - displays the width of the main window in pixels
- **hei** (Height) - displays the height of the main window in pixels
- **dcl** (Default Color) - Sets the default color when adding a new color in indexed color mode
- **dfx** (Default Effect) - Sets the default effect when adding a new effect to an effects chain
- **fx** (Toggle Effects) - Toggles the usage of effects
- **sub** (Toggle Subpixels) - Toggles the render of subpixels
- **fdb** (Toggle Feedbacl) - Toggles the virtual feedback engine
- **col** (Toggle Colormodes) - Toggles the availability of color modes
- **zom** (Zoom) - Sets the size of the GUI
- **trn** (Transparency) - Sets the transpareny of the GUI in the main window
- **tip** (Tooltips) - Toggles the display of tooltip boxes when hovering over a parameter name
- **lab** (Labels) - Toggles the display of labels next to sliders
- **btn** (Buttons) - Toggles the display of buttons next to sliders

### Menubar

You can access some actions and all import and export dutys from the menubar of the application.

#### File

- Save - Save the current patch as a .txt file
- Open - Open a saved patch
- Exports As > JPG - Export the current frame as a JPG of the render (GUI will not be visible)
- Exports As > PNG - Export the current frame as a PNG of the render (GUI will not be visible)
- Record GIF > Start - starts the recording of a GIF of the render (GUI will not be visible). A flashing red dot will appear (the dot is not visible in the GIF).
- Record GIF > Stop - ends the recording of a GIF, creates a .gif file and opens a save dialog
- Record WEBM > Start - recording of a WEBM video of the render (GUI will not be visible).  A flashing red dot will appear (the dot is not visible in the WEBM)
- Record WEBM > Stop - ends the recording of a WEBM video, creates a .webm file and opens a save dialog
- Reset Patch - Clears the internal storage and loads the default patch

#### Render

- Play - Start the clock for the renderprocess
- Pause - Pauses the clock for the renderprocess
- Stop - Turns the renderprocess off until play is clicked
- Jump 1 Frame - Increments the clock for the render process once and renders once. Useful when trying to get to specific look when having the render paused or stopped.
- Jump 10 Framse - Increments the clock for the render process by 10 and renders once. Useful when trying to get to specific look when having the render paused or stopped.
- Refresh - Simply renders again when the render is stopped manually. Normally any parameter change will trigger a refresh as well
- Reseed - Reseed all noise oscilators and the SRNG for the global effects

#### Window

- Open GUI - Opens the GUI in the main window
- Close GUI - Closes the GUI in the main window
- Undock GUI - Creates a new window with the GUI in it, so you can control the render from a seperate window, optimal for VJing
- Destroy GUI - Destroys a created GUI window
- Undock Render - Creates a new window with the render in it, so you can display it in a seperate window, optimal for VJing
- Destroy Render - Destroys a created render window

#### Help

- Open Documentation - Opens a new window containing the full documentation (this document)

## Releases

Below you can find release notes on all major releases that had a dedicated build available. Look into the devlog over at [acidatm.itch.io/acid](https://acidatm.itch.io/acid) for more details.

- **0.1.2** WebGL Update
  - ACID is now using WebGL instead of simple canvas which increases performance dramatically
  - A new subpixel option to get a more tv or analog look and feel
  - A new virtual feedback mode that simulates real camera to tv to camera feedback
  - A dedicated render only window can be undocked now, which makes use for VJing way better
  - Specific settings for framerate and resolution in main and undocked window
  - Additional settings for black and white fading and color burn out
  - Color modes are now based on 3 color channels instead of a singular value
  - Gradient color modes can now have any amount of steps
  - Many performance optimisations in the code
  - Additional optimization settings that can disable certain parts of the program for a better performance
  - Two new oscilators added: *pwm*, which is a pulse oscilator, and *org* which is a noise algorithm specialised for organic shape creation
  - A new random patch option in the menu
  - Keyboard shortcuts for various menu functions
  - Added analytics such as true framerate, width and height
  - Removed hsl color mode (but will be back soon, no worries)
  - Removed different render engines for now
  - Removed some unused parameters from the codebase
  - Removed some unnecessary settings in the GUI
  - Reverted to old window styles on Mac OS
  - Oscilator frequency as no longer linked to resolution
  - Renderloop is now called recursive at the start of the loop, making each frame roughly equal, no matter the calculation time
- **0.1.1** Release of the full alpha version
  - Reworked the *lpf* and *hpf* parameters to be relative to the *min* and *max* property
  - Removed the *amp* parameter on all oscilators, as it's behavior can be duplicated using the *max* parameter
  - Reworked the *amp* parameter on the bus to not be able to overdrive the sum (use a *drv* effect instead)
  - Reworked all algorithmic oscilators to use fewer parameters
  - Added *off* as an oscilator type. Works just like toggling the oscilator when clicking on *osx*
  - Added *hsl* as a color mode
  - Enabled full 360 degree turning of oscilators with the *mod* parameter and removed the *rmp* oscilator shape (as its just a rotated *saw* oscilator)
  - Added a new oscilator shape *osc*, that can be faded between pure triangle over pure sine to pure square and also has pulse width modulation capabilitys.
  - Added sliders to the GUI, made number input optional, added optional buttons
  - Made the GUI have linear values for zoom and transparency, instead of different, fixed settings
  - Removed global effects (*err*) and instead added two more oscilators
  - Reworked the complex 2D render engine (*c2d*) to have dedicated values for the radius of all corners and the padding on all sides as well as a simple 2d render engine running "below" it, to control the background color of each cell
  - Made the compressor (*cmp*) work in one direction only, added a new expander (*exp*) effect that now works in reverse to compression
  - Added optional tooltips to the GUI
  - Added automatic load of a default patch upon first (or resetted) start up
  - Added a patch reset option to clear out a faulty storage and to automatically load a default patch
  - Added a stop option, to completely disable the rerender of the scene until play is hit
  - Added a framejump option, to increment the t value, when the render is paused or stopped
  - Fixed a bug, where the GUI would jump when an input was changed
  - Removed deprecated electron.js functions
  - Added proper error handling in case of crashes
  - Did some visual changes on the GUI
  - Unused parameters are now hidden in the UI until they are needed
- **0.1.0** Release of the initial alpha version

## Future Plans

This is a very early state of this software, I plan to extend it regularly. I currently plan to do these things:

- Adding LFOs and sequencers
- Adding an FM based oscilator
- Adding multiple presets within one patch file
- Adding audioreactive functionality
- Adding multiple render engines
- Adding bitmaps, image to bitmap import and tools to manipulate and animate both
- Adding a built-in, keyframe based timeline to automate parameter changes in a video editor like fashion
- Adding basic MIDI support, so that parameters can be controlled with CC and presets may be changed with PCM
- Adding OSC support, so that parameters can be controlled with software like ORCA
- Adding a Serial Port implementation, so that parameters can be controlled with microcontroller based hardware and/or sensors
- Reworking the GUI to use React.js
- Reworking the GUI to use modular patching
- Adding a shell like interface with a command line
- Adding a custom live coding environment
- Restructuring the code to be more dev friendly, so other people can write new engines, effects, oscilators and so on
- Adding live performance features such as momentary effects and preprogrammed parameter changes in scenes

At this point you know all there is to know. Now go and make something on ACID :)
