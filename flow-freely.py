from flask import Flask, render_template, request, json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/board', methods=['GET', 'POST'])
def updateGame():
    if request.method == 'GET':
        # return the board state we have saved
        pass
    else:
        json_return = dict()
        try:
            json_return = request.get_json(force=True)
        except ValueError:
            return "invalid JSON"
        for key in json_return:
            print(key, json_return[key]["label"], json_return[key]["hex"]["Id"])
            for hex in json_return[key]["connections"]:
                print(hex["Id"], end=' ')
            print()
            print()
        return "valid json"


@app.route('/dumb')
def dumb():
    return render_template('dumbTest.html')


if __name__ == '__main__':
    app.run()
