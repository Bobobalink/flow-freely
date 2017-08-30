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
        try:
            json_return = request.get_json(force=True)
        except ValueError:
            return "invalid JSON"
        for key in json_return:
            print(key, json_return[key]["label"], json_return[key]["hex"]["Id"])
            for h in json_return[key]["connections"]:
                print(h["Id"], end=' ')
            print()
            print()
        return "valid json"

if __name__ == '__main__':
    app.run()
