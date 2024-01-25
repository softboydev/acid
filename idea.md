# ACID

Algorithms Create Image Data

## Abstract

ACID is a programming language that uses single character commands to generate a precompiled, determenistic vertex shader.

## Commands

All commands consist of single characters that take an input on the right side and give an output to the left. If you would like to summarise two values and store them into a variable you would do it like this

```
A+34
```

Which would write the sum of `3` and `4`  into the variable named `A`

## Rendering

The image is rendered by giving a 3 channel color value for every pixel for every point in time. The whole code is run for every coordinate ranging from 0 to 1 as `X` and `Y` and passing a timestamp `T`. To add a color value to the render the value needs to be passed to the `#` command. This would draw a gradient from black to white:

```
*xy
```

Which translates to: add the result of the multiplication of the x and y coordinate to the render. x and y range from 0 to 1 which is translated into color ranging from black (0,0,0) to white (1,1,1).

If you would want to draw the gradient from black to red you would write it like this:

```
#*xy00
```

And if you would want to draw the gradient from red to black you would write it like this:

```
#-1*xy00
```

