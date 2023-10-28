let NUM_STRIPS_PER_BELT = 2
let NUM_LEDS_PER_STRIP = 49
// LED PINS
let pinL1A = DigitalPin.P0
let pinL1B = DigitalPin.P1
let pinL2A = DigitalPin.P8
let pinL2B = DigitalPin.P9
let PIN_ARR_LEDS = [pinL1A, pinL1B, pinL2A, pinL2B]
let NUM_PIN_LEDS = PIN_ARR_LEDS.length
// MOTOR PINS
let pinM1A = PCA9685.LEDNum.LED15
let pinM1B = PCA9685.LEDNum.LED16
let pinM2A = PCA9685.LEDNum.LED13
let pinM2B = PCA9685.LEDNum.LED14
let PIN_ARR_MOTORS = [pinM1A, pinM1B, pinM2A, pinM2B]
let NUM_PIN_MOTORS = PIN_ARR_MOTORS.length
// NEOPIXEL
let strip1A = neopixel.create(pinL1A, NUM_LEDS_PER_STRIP, NeoPixelMode.RGB)
let strip1B = neopixel.create(pinL1B, NUM_LEDS_PER_STRIP, NeoPixelMode.RGB)
let strip2A = neopixel.create(pinL2A, NUM_LEDS_PER_STRIP, NeoPixelMode.RGB)
let strip2B = neopixel.create(pinL2B, NUM_LEDS_PER_STRIP, NeoPixelMode.RGB)
let pause1 = 0
let pause2 = 0
let STRIP_ARR = [strip1A, strip1B, strip2A, strip2B]
// PCA9685
let motor1A = 0
let motor1B = 0
let motor2A = 0
let motor2B = 0
let MOTOR_ARR = [motor1A, motor1B, motor2A, motor2B]
let ADDRESS = PCA9685.chipAddress("0x40")
// SPEED
let STOP = 0
let SPEED_1 = 20
let SPEED_2 = 100
// LIGHT
let LED_BRIGHTNESS = 255
let PAUSE_0 = 500
let PAUSE_1 = 200
let PAUSE_2 = 100
let ledPosition11 = 0
let ledPosition12 = 0
let ledPosition21 = 0
let ledPosition22 = 0
// STATE MACHINE CONSTANTS
let STATE_STOP = 0
let STATE_SPEED_1 = 1
let STATE_SPEED_2 = 2
let STATE_SPEED_1_INV = 3
let STATE_SPEED_2_INV = 4

//// INIT
let state1 = STATE_STOP
let state2 = state1
for (let i = 0; i < STRIP_ARR.length; i++){
    STRIP_ARR[i].setBrightness(LED_BRIGHTNESS)
}
PCA9685.reset(ADDRESS)
PCA9685.setLedDutyCycle(pinM1A, motor1A, ADDRESS)
PCA9685.setLedDutyCycle(pinM1B, motor1B, ADDRESS)
PCA9685.setLedDutyCycle(pinM2A, motor2A, ADDRESS)
PCA9685.setLedDutyCycle(pinM2A, motor2B, ADDRESS)

//// MAIN
basic.forever(function(){
    if (state1 === STATE_STOP){
        motor1A = STOP
        motor1B = STOP
        pause1 = PAUSE_0
    } else if (state1 === STATE_SPEED_1){
        motor1A = STOP
        motor1B = SPEED_1
        pause1 = PAUSE_1
    } else if (state1 === STATE_SPEED_2){
        motor1A = STOP
        motor1B = SPEED_2
        pause1 = PAUSE_2
    }
    PCA9685.setLedDutyCycle(pinM1A, motor1A, ADDRESS)
    PCA9685.setLedDutyCycle(pinM1B, motor1B, ADDRESS)
})

basic.forever(function () {
    if (state2 === STATE_STOP) {
        motor2A = STOP
        motor2B = STOP
        pause2 = PAUSE_0
    } else if (state2 === STATE_SPEED_1) {
        motor2A = STOP
        motor2B = SPEED_1
        pause2 = PAUSE_1
    } else if (state2 === STATE_SPEED_2) {
        motor2A = STOP
        motor2B = SPEED_2
        pause2 = PAUSE_2
    }
    PCA9685.setLedDutyCycle(pinM2A, motor2A, ADDRESS)
    PCA9685.setLedDutyCycle(pinM2B, motor2B, ADDRESS)
})

basic.forever(function(){
    for (let i = 0; i <= 49; i++) {
        strip1A.clear()
        strip1B.clear()
        // Add three running LEDs
        for (let j = 0; j <= 2; j++) {
            ledPosition11 = (i + j) % NUM_LEDS_PER_STRIP
            strip1A.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition11, neopixel.rgb(255, 50, 0))
            strip1B.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition11, neopixel.rgb(255, 50, 0))
        }
        // Add a second group of running LEDs with an offset
        for (let k = 0; k <= 2; k++) {
            // Half-length offset of 25
            ledPosition12 = (i + k + 25) % NUM_LEDS_PER_STRIP
            strip1A.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition12, neopixel.rgb(255, 50, 0))
            strip1B.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition12, neopixel.rgb(255, 50, 0))
        }
        strip1A.show()
        strip1B.show()
        // Adjust the speed using the 'speed' variable
        basic.pause(pause1)
    }
})

basic.forever(function(){
    for (let i = 0; i <= 49; i++) {
        strip2A.clear()
        strip2B.clear()
        // Add three running LEDs
        for (let j = 0; j <= 2; j++) {
            ledPosition21 = (i + j) % NUM_LEDS_PER_STRIP
            strip2A.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition21, neopixel.rgb(255, 50, 0))
            strip2B.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition21, neopixel.rgb(255, 50, 0))
        }
        // Add a second group of running LEDs with an offset
        for (let k = 0; k <= 2; k++) {
            // Half-length offset of 25
            ledPosition22 = (i + k + 25) % NUM_LEDS_PER_STRIP
            strip2A.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition22, neopixel.rgb(255, 50, 0))
            strip2B.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition22, neopixel.rgb(255, 50, 0))
        }
        strip2A.show()
        strip2B.show()
        // Adjust the speed using the 'speed' variable
        basic.pause(pause2)
    }
})

input.onButtonPressed(Button.A, function () {
    state1 += 1
    if (state1 > 2) {
        state1 = 0
    }
})

input.onButtonPressed(Button.B, function () {
    state2 += 1
    if (state2 > 2) {
        state2 = 0
    }
})