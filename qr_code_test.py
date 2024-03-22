import requests
import json
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF, renderPM

url = "https://api.qr-code-generator.com/v1/create?access-token=SSYC3U-QRVH5XdmHpgkygZ52999ajb9Foe6cF-erqspHL-8UahSc2oEOApvI_COO"

payload = json.dumps({
  "frame_name": "bottom-frame",
  "qr_code_text": "{\"ticketType\": \"Standard\", \"price\": 10, \"ticketQuantity\": 487, \"id\": 0, \"customer\": {\"name\": \"John Doe\", \"email\": \"john.doe@example.com\"}}",
  "image_format": "SVG",
  "frame_color": "#02bfff",
  "frame_icon_name": "mobile",
  "frame_text": "Eventifyed",
  "marker_left_template": "version13",
  "marker_right_template": "version13",
  "marker_bottom_template": "version13",
})
headers = {
  'Content-Type': 'application/json',
  'Cookie': 'AWSALB=mjK0XwMtS9Sta9QVo0hZaph6Nyqb9tqVQfZvFDr93eL/Zx9zqUnssj56QNCB1v6cCSzB9vfsQ3lb+LSmaTICrBh5ugDeeTj9yctmifsNWfEFtphXyg5LE4Tc8sE6; AWSALBCORS=mjK0XwMtS9Sta9QVo0hZaph6Nyqb9tqVQfZvFDr93eL/Zx9zqUnssj56QNCB1v6cCSzB9vfsQ3lb+LSmaTICrBh5ugDeeTj9yctmifsNWfEFtphXyg5LE4Tc8sE6'
}

response = requests.post(url, headers=headers, data=payload)

if response.status_code == 200:
    # Save the SVG content to a file
    with open('output.svg', 'w', encoding='utf-8') as file:
        file.write(response.text)

    # Convert SVG to PNG (optional, for visualization purposes)
    drawing = svg2rlg("output.svg")
    renderPM.drawToFile(drawing, "output.png", fmt="PNG")

    print("QR code saved as output.svg and output.png")
else:
    print(f"Error: {response.status_code} - {response.text}")
