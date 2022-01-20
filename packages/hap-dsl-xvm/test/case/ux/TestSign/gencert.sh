#!/usr/bin/env bash
openssl req -newkey rsa:2048 -nodes -keyout private.pem -x509 -days 365 -out certificate.pem