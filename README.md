# Exus(Alpha)
Your global login bruteforcer.

## Installation
Github:
```
git clone https://github.com/OTAKKATO/exus
```

NPM Packages:
```
npm i argparse parallel-park request-async fs
```

## Usage
```
usage: index.js [-h] -u URL [-dt DATA] -m METHOD [-p PLUGINS] -user USERNAME -d DICTIONARY

optional arguments:
  -h, --help            show this help message and exit
  -u URL, --url URL     The target website login API.
  -dt DATA, --data DATA
                        The data to send.
  -m METHOD, --method METHOD
                        Method to use.(Supported: GET, POST, PUT, PATCH)
  -p PLUGINS, --plugins PLUGINS
                        The plugins to use and they are executed in order.
  -user USERNAME, --username USERNAME
                        The target username.
  -d DICTIONARY, --dictionary DICTIONARY
                        A file that contains passwords.
```

## License
MIT © OTAK