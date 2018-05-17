import random


def printData(b_id,b_x,b_y,b_zoom,b_rotation):
    print('[Bits ID] : ',b_id)
    print('[Bits X] : ',b_x)
    print('[Bits Y] : ',b_y)
    print('[Bits ZOOM] : ',b_zoom)
    print('[Bits ROTATION] : ',b_rotation)


#Method to convert asset data to bits
def convert(id,x,y,zoom,rotation):
    b_id = bin(id)[2:].zfill(5)  #5 places for id
    b_x = bin(x)[2:].zfill(12) #12 places for x
    b_y = bin(y)[2:].zfill(12) #12 places for y
    b_zoom = bin(zoom)[2:].zfill(9) #9 places for zoom
    b_rotation = bin(rotation)[2:].zfill(8) #8 places for rotation

    bit_rep = b_id + b_x+b_y+b_zoom+b_rotation

    # print(b_id, b_x, b_y, b_zoom, b_rotation)
    return bit_rep


#Generate random N assets
def generateRandomAssets(n):
    final_bit = ""
    for i in range(0,n):
        _id = random.randint(1, 1022)
        x = random.randint(1, 2480)
        y = random.randint(1, 3508)
        zoom = random.randint(0, 200)
        rotation = random.randint(0, 360)
        final = convert(_id, x, y, zoom, rotation)
        final_bit+=final

    return final_bit
    

def split2len(s, n):
    def _f(s, n):
        while s:
            yield "0x"+s[:n]
            s = s[n:]
    return list(_f(s, n))



def generateBytes(n):
    print("While generating " + str(n) + " assets: ")
    final_bit = generateRandomAssets(n)
    final_hex = hex(int(final_bit,2))[2:]
    arrayHex = split2len(hex(int(final_bit,2))[2:],62)
    for i in range(0,len(arrayHex)):
        print ('[HEX] : ' + arrayHex[i])
    print ('[BIN] :  ----> ' + final_bit)
    # print('Array of bytes32' , arrayHex )
    return arrayHex




