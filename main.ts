let NUM_STRIPS_PER_BELT = 2
let NUM_LEDS_PER_STRIP = 49

// LED PINS
let PIN_L1A = DigitalPin.P0
let PIN_L1B = DigitalPin.P1
let PIN_L2A = DigitalPin.P2
let PIN_L2B = DigitalPin.P8
let PIN_ARR_LEDS = [PIN_L1A, PIN_L1B, PIN_L2A, PIN_L2B]
let NUM_PIN_LEDS = PIN_ARR_LEDS.length

// MOTOR PINS
let PIN_M1A = PCA9685.LEDNum.LED15
let PIN_M1B = PCA9685.LEDNum.LED16
let PIN_M2A = PCA9685.LEDNum.LED13
let PIN_M2B = PCA9685.LEDNum.LED14
let PIN_ARR_MOTORS = [PIN_M1A, PIN_M1B, PIN_M2A, PIN_M2B]
let NUM_PIN_MOTORS = PIN_ARR_MOTORS.length

// NEOPIXEL
let strip1A = neopixel.create(PIN_L1A, NUM_LEDS_PER_STRIP, NeoPixelMode.RGB)
let strip1B = neopixel.create(PIN_L1B, NUM_LEDS_PER_STRIP, NeoPixelMode.RGB)
let strip2A = neopixel.create(PIN_L2A, NUM_LEDS_PER_STRIP, NeoPixelMode.RGB)
let strip2B = neopixel.create(PIN_L2B, NUM_LEDS_PER_STRIP, NeoPixelMode.RGB)
let pause1 = 0
let pause2 = 0
let STRIP_ARR = [strip1A, strip1B, strip2A, strip2B]

// BUTTONS
let PIN_B1 = DigitalPin.P14
let PIN_B2 = DigitalPin.P15
let PIN_B1L = DigitalPin.P9
let PIN_B2L = DigitalPin.P13
pins.setPull(PIN_B1,PinPullMode.PullUp)
pins.setPull(PIN_B2,PinPullMode.PullUp)
let stripButton1 = neopixel.create(PIN_B1L,10, NeoPixelMode.RGB)
let stripButton2 = neopixel.create(PIN_B2L,10, NeoPixelMode.RGB)

// COLORS
let COL_ORANGE = 16725760
let COL_BLUE = NeoPixelColors.Blue
let COL_EMPTY = NeoPixelColors.Black
let COL_GREEN = NeoPixelColors.Green
let COL_RED = NeoPixelColors.Red
let COL_FORWARD = COL_GREEN
let COL_STOP = COL_RED
let COL_BACKWARD = COL_ORANGE


// DEBOUNCING
let lastButtonState1 = 0
let lastButtonState2 = 0
let lastDebounceTime1 = 0
let lastDebounceTime2 = 0
let TIME_DEBOUNCE = 30
let buttonState1 = 1
let buttonState2 = 1
let PIN_PRESSED = 0

// PCA9685
let motor1A = 0
let motor1B = 0
let motor2A = 0
let motor2B = 0
let MOTOR_ARR = [motor1A, motor1B, motor2A, motor2B]
let ADDRESS = PCA9685.chipAddress("0x40")

// SPEED
let STOP = 0
let SPEED = 100
let SPEED_SLOW = 20

// LIGHT
let LED_BRIGHTNESS = 255
let DELAY_STRIP_STOP = 500
let DELAY_STRIP = 200
let DELAY_STRIP_SLOW = 100
let ledPosition11 = 0
let ledPosition12 = 0
let ledPosition21 = 0
let ledPosition22 = 0

/////////////////////////////////////////////////////////////
//// STATE MACHINE CONSTANTS
// MOTORS
let STATE_STOP = 0
let STATE_FORWARD = 1
let STATE_BACKWARD = 2
let STATE_FORWARD_SLOW = 3
let STATE_BACKWARD_SLOW = 4

// BUTTONS
let B_STATE_FORWARD = 0
let B_STATE_BACKWARD = 1
let B_STATE_STOP = 2

/////////////////////////////////////////////////////////////
//// INIT
let buttonsBusy = false
let reverse = false
let i = 0
let i2 = 0
let state1 = STATE_STOP
let state2 = STATE_STOP
let bState1 = B_STATE_STOP
let bState2 = B_STATE_STOP
for (let i = 0; i < STRIP_ARR.length; i++){
    STRIP_ARR[i].setBrightness(LED_BRIGHTNESS)
}
PCA9685.reset(ADDRESS)
PCA9685.setLedDutyCycle(PIN_M1A, motor1A, ADDRESS)
PCA9685.setLedDutyCycle(PIN_M1B, motor1B, ADDRESS)
PCA9685.setLedDutyCycle(PIN_M2A, motor2A, ADDRESS)
PCA9685.setLedDutyCycle(PIN_M2A, motor2B, ADDRESS)

/////////////////////////////////////////////////////////////
//// MOTOR MODES
basic.forever(function(){
    if (state1 === STATE_STOP){
        motor1A = STOP
        motor1B = STOP
        pause1 = DELAY_STRIP_STOP
    } else if (state1 === STATE_FORWARD){
        motor1A = STOP
        motor1B = SPEED
        pause1 = DELAY_STRIP
        reverse = false
    } else if (state1 === STATE_BACKWARD){
        motor1A = SPEED
        motor1B = STOP
        pause1 = DELAY_STRIP_SLOW
        reverse = true
    }
    PCA9685.setLedDutyCycle(PIN_M1A, motor1A, ADDRESS)
    PCA9685.setLedDutyCycle(PIN_M1B, motor1B, ADDRESS)
})

basic.forever(function () {
    if (state2 === STATE_STOP) {
        motor2A = STOP
        motor2B = STOP
        pause2 = DELAY_STRIP_STOP
    } else if (state2 === STATE_FORWARD) {
        motor2A = STOP
        motor2B = SPEED
        pause2 = DELAY_STRIP
        reverse = false
    } else if (state2 === STATE_BACKWARD) {
        motor2A = SPEED
        motor2B = STOP
        pause2 = DELAY_STRIP_SLOW
        reverse = true
    }
    PCA9685.setLedDutyCycle(PIN_M2A, motor2A, ADDRESS)
    PCA9685.setLedDutyCycle(PIN_M2B, motor2B, ADDRESS)
})
/////////////////////////////////////////////////////////////
//// LED STRIPS
basic.forever(function(){
    strip1A.clear()
    strip1B.clear()
    if (!reverse){
        for (let j = 0; j <= 2; j++) {
            ledPosition11 = (i + j) % NUM_LEDS_PER_STRIP
            strip1A.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition11, COL_FORWARD)
            strip1B.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition11, COL_FORWARD)
        }
        for (let k = 0; k <= 2; k++) {
            ledPosition12 = (i + k + 25) % NUM_LEDS_PER_STRIP
            strip1A.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition12, COL_FORWARD)
            strip1B.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition12, COL_FORWARD)
        }
    } else {
        for (let j = 0; j <= 2; j++) {
            ledPosition11 = NUM_LEDS_PER_STRIP - (i + j) % NUM_LEDS_PER_STRIP
            strip1A.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition11, COL_BACKWARD)
            strip1B.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition11, COL_BACKWARD)
        }
        for (let k = 0; k <= 2; k++) {
            ledPosition12 = NUM_LEDS_PER_STRIP - (i + k + 25) % NUM_LEDS_PER_STRIP
            strip1A.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition12, COL_BACKWARD)
            strip1B.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition12, COL_BACKWARD)
        }
    }
    i = i + 1
    if (i >= NUM_LEDS_PER_STRIP){
        i = 0
    }
    strip1A.show()
    strip1B.show()
    basic.pause(pause1)
})

basic.forever(function(){
    strip2A.clear()
    strip2B.clear()

    ledPosition21 = i2
    ledPosition22 = i2 + 25 % NUM_LEDS_PER_STRIP

    for (let j = 0; j <= 2; j++) {
        ledPosition21 = (i + j) % NUM_LEDS_PER_STRIP
        strip2A.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition21, neopixel.rgb(255, 50, 0))
        strip2B.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition21, neopixel.rgb(255, 50, 0))
    }
    for (let k = 0; k <= 2; k++) {
        ledPosition22 = (i + k + 25) % NUM_LEDS_PER_STRIP
        strip2A.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition22, neopixel.rgb(255, 50, 0))
        strip2B.setPixelColor(NUM_LEDS_PER_STRIP - ledPosition22, neopixel.rgb(255, 50, 0))
    }
    i2 = i2 + 1
    if (i2 >= NUM_LEDS_PER_STRIP){
        i2 = 0
    }
    strip2A.show()
    strip2B.show()
    basic.pause(pause2)
})

/////////////////////////////////////////////////////////////
//// BUTTONS
basic.forever(function() {
    debounceButton1()
    debounceButton2()
    if (!buttonsBusy){
        if (bState1 === B_STATE_STOP){
            stripButton1.showColor(COL_STOP)
            state1 = STATE_STOP
        } else if (bState1 === B_STATE_FORWARD){
            stripButton1.showColor(COL_FORWARD)
            state1 = STATE_FORWARD
        } else if (bState1 === B_STATE_BACKWARD){
            stripButton1.showColor(COL_BACKWARD)
            state1 = STATE_BACKWARD
        }
        if (bState2 === B_STATE_STOP) {
            stripButton2.showColor(COL_STOP)
            state2 = STATE_STOP
        } else if (bState2 === B_STATE_FORWARD) {
            stripButton2.showColor(COL_FORWARD)
            state2 = STATE_FORWARD
        } else if (bState2 === B_STATE_BACKWARD) {
            stripButton2.showColor(COL_BACKWARD)
            state2 = STATE_BACKWARD
        }
    }
})

/////////////////////////////////////////////////////////////
//// FUNCTIONS
function debounceButton1() {
    let currentTime = input.runningTime()
    let buttonRead = pins.digitalReadPin(PIN_B1)
    if (buttonRead !== lastButtonState1) {
        lastDebounceTime1 = currentTime
    }
    if (input.runningTime() - lastDebounceTime1 > TIME_DEBOUNCE) {
        if (buttonRead !== buttonState1) {
            buttonState1 = buttonRead
            if (buttonState2 !== PIN_PRESSED) {
                if (buttonState1 === PIN_PRESSED){
                    buttonsBusy = true
                    stripButton1.showColor(COL_BLUE)
                    bState1 += 1
                    if (bState1 > 2) {
                        bState1 = 0
                    }
                } else {
                    buttonsBusy = false
                }
            }
        }
    }
    lastButtonState1 = buttonRead
}

function debounceButton2() {
    let currentTime = input.runningTime()
    let buttonRead = pins.digitalReadPin(PIN_B2)
    if (buttonRead !== lastButtonState2) {
        lastDebounceTime2 = currentTime
    }
    if (input.runningTime() - lastDebounceTime2 > TIME_DEBOUNCE) {
        if (buttonRead !== buttonState2) {
            buttonState2 = buttonRead
            if (buttonState1 !== PIN_PRESSED) {
                if (buttonState2 === PIN_PRESSED){
                    buttonsBusy = true
                    stripButton2.showColor(COL_BLUE)
                    bState2 += 1
                    if (bState2 > 2) {
                        bState2 = 0
                    }
                } else {
                    buttonsBusy = false
                }
            }
        }
    }
    lastButtonState2 = buttonRead
}