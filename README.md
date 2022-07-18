# Exus(Alpha)
Your global login bruteforcer.

## Installation
Github:
```
git clone https://github.com/OTAKKATO/exus
```

NpmJS:
```
npm i parallel-park commander request-async ssh2-promise fs
```

## Usage
```
node index.js <service> <args>
```

- service - The service to use.
- args - The args to use in the specified service.

## Example
```
node index.js ssh -ip 1.1.1.1 -user admin -d passwords.txt
```

## Supported Services
- Website
- SSH

## License
MIT © OTAK