 
import sys 
import numpy as np
import imutils
import cv2
import os 

pathImage = sys.argv[1]
mode = sys.argv[2]

# outputDir = "documentDestructor/output/"

outputDir = "temporary/"

dowodRatio = 85.6/53.98
documentPos = []

threshold1 = [ 60, 150, 225 ]
threshold2 = [ 30, 120, 200 ]


# znajdowanie prostokata najbardziej przypominającego dowod
def findDowod(rectsArray, targetRatio) :
  bestRect = rectsArray[0]
  bestDelta = 1
  for rect in rectsArray :
    ratio = getRatio(rect)
    if abs(ratio-targetRatio) < bestDelta :
      bestDelta = abs(ratio-targetRatio)
      bestRect = rect
  return bestRect

# obliczanie proporcji prostokąta
def getRatio(rect) :
  pivot = rect[0]
  # distances = sorted(rect , key = np.linalg.norm(), reverse = True)
  distances = []
  for point in rect :
    distances.append(np.linalg.norm(pivot-point))
  sides = sorted(distances) [:3]
  aspectRatio = sides[2]/sides[1]
  return aspectRatio

# transformacja perspektywiczna
def wrapTransform(cnt, img) :

  pts = cnt.reshape(4,2)
  rect = np.zeros((4,2), dtype = "float32")

  sum = pts.sum(axis = 1)
  rect[0] = pts[np.argmin(sum)]
  rect[2] = pts[np.argmax(sum)]

  diff = np.diff(pts, axis = 1)
  rect[1] = pts[np.argmin(diff)]
  rect[3] = pts[np.argmax(diff)]

  (tl, tr, br, bl) = rect
  widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
  widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))

  heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
  heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))

  maxWidth = max(int(widthA), int(widthB))
  maxHeight = max(int(heightA), int(heightB))
  dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype = "float32")
  
  M = cv2.getPerspectiveTransform(rect, dst)
  wrap = cv2.warpPerspective(img, M, (maxWidth, maxHeight))

  return wrap

def cropFace(filename) : 
  face = cv2.imread(outputDir+fileName+"/face.jpg")
  [[[281, 141]],[[ 20, 141]],[[ 20, 475]],[[281, 475]]]
  cropedFace = face[141:475, 20:281]
  cv2.imwrite(outputDir+fileName+"/face.jpg", cropedFace)


#Start#################################################################################
img = cv2.imread(pathImage)
ori = img.copy()
imgContours = img
if (mode =='passport') :
  document = ori
  fileName = (pathImage.split("/")[-1]).split(".")[0]
  fileName = (fileName.split("\\")[-1])
  if not os.path.exists(outputDir+fileName) :
    os.makedirs(outputDir+fileName)
  print("filename = "+fileName)
else :
  imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
  img_blur = cv2.GaussianBlur(img,(5,5),1)

  for thr1 in threshold1 :
    for thr2 in threshold2 :
      edges = cv2.Canny(img_blur, thr1, thr2)
      kernel = np.ones((5, 5))
      imgDial = cv2.dilate(edges, kernel, iterations=2)
      imgThreshold = cv2.erode(imgDial, kernel, iterations=1)
      contours = cv2.findContours(imgThreshold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
      contours = imutils.grab_contours(contours)
      contours = sorted(contours, key= cv2.contourArea, reverse= True) [:10]
      for cnt in contours:
        if cv2.contourArea(cnt) > 5000:
          peri = cv2.arcLength(cnt, True)
          approx = cv2.approxPolyDP(cnt, 0.04 * peri, True)
          if len(approx) == 4:
            documentPos.append(approx)
  #documentPos = sorted(documentPos, key= cv2.contourArea, reverse= True) [:1]
  if len(documentPos) :
    fileName = (pathImage.split("/")[-1]).split(".")[0]
    fileName = (fileName.split("\\")[-1])
    if not os.path.exists(outputDir+fileName) :
      os.makedirs(outputDir+fileName)
    dowodContur = findDowod(documentPos, dowodRatio)

    print("filename = "+fileName)
    #rysowanie wszystkich znalezionych prostokatow

    # for approx in documentPos :
    #   cv2.drawContours(imgContours, [approx], -1, (0,255,0), 3)

    # rysowanie wybranego prostokata

    # cv2.drawContours(imgContours, [dowodContur], -1, (0,255,0), 3)
    # cv2.imshow("test", cv2.resize(imgContours, (0, 0), fx=0.5, fy=0.5))
    # cv2.waitKey()
    
    document = wrapTransform(dowodContur,ori)
    docH = document.shape[0]
    docW = document.shape[1]

  #nazyw mask 
  front = ["face.jpg","surname.jpg","names.jpg","familyname.jpg","parentsname.jpg","birthdate.jpg","sex.jpg"]
  #
  back = ["MRZ.jpg","id.jpg","birthplace.jpg","expirydate.jpg","inssuingauthority.jpg","issuedate.jpg","nationality.jpg","pesel.jpg"]
  #
  passport = ["BirthDate.jpg","BirthPlace.jpg","Code.jpg","ExpairyDate.jpg","Face.jpg","ID.jpg","IssueAuthority.jpg","IssueDate.jpg","MRZ.jpg","Names.jpg","Nationality.jpg","Pesel.jpg","Pesel.jpg","Signature.jpg","Surname.jpg","Type.jpg"]

  # Wybor trybu 
  current = []
  if ( mode == "front" ) :
    current = front
  elif ( mode == "back") :
    current = back
  elif ( mode == "passport") :
    current = passport
  else :
    raise Exception("Invalid arguments")

  print(mode)
  # Wyznaczanie rozmiaru maski oraz zmiana rozmiaru dokumentu
  maskShape = cv2.imread("src/documentDestructor/masks/"+mode+"/shape.jpg", cv2.IMREAD_GRAYSCALE)
  msH = maskShape.shape[0]
  msW = maskShape.shape[1]

  document = cv2.resize(document, (msW, msH), interpolation=cv2.INTER_AREA)

  cv2.imwrite(outputDir+fileName + "/"+ "document.jpg", document)

  for mask in current:
    print(mask)
    maskImg = cv2.imread("src/documentDestructor/masks/"+mode+"/"+ mask, cv2.IMREAD_GRAYSCALE)
    _, curMask = cv2.threshold(maskImg, thresh=180, maxval=255, type=cv2.THRESH_BINARY)
    masked = cv2.bitwise_and(document, document,mask=curMask)
    masked = cv2.cvtColor(masked, cv2.COLOR_BGR2GRAY)
    if mask != "face.jpg":
      masked = cv2.GaussianBlur(masked,(5,5),0)
      masked = cv2.adaptiveThreshold(masked, 255,cv2.ADAPTIVE_THRESH_MEAN_C,cv2.THRESH_BINARY,19,14)
      masked = cv2.dilate(masked, (3,3), iterations=3)
      masked = cv2.erode(masked, (3,3), iterations=1)
    #binaryzacja

    cv2.imwrite(outputDir+fileName + "/" + mask, masked)
    print("DONE")
  if ( mode == "front" ) :
    cropFace(fileName)