# How to install new Nginx server & enable SSL

## Apply for:

- DOMAIN: https://dev.music-player-system-api.com
- Elastic IP: http://54.168.193.239:3009/

## PREPARATION: Connect Elastic IP with DOMAIN

- Ensure that DOMAIN music-player-system-api.com is registered on Route 53

- Create new DNS record:

| Type | Name | Data           |
| ---- | ---- | -------------- |
| A    | dev  | 54.168.193.239 |

- Verify domain dev.music-player-system-api.com with ACM ( AWS Certificate Manager )

  - Request a certificate for dev.music-player-system-api.com
  - Create new DNS record ( add to Route53 if you are using Domain that is registered on Route 53):
    | Type | Name | Data |
    | ----- | -------------------------------------------------- | -------------------------------------------- |
    | CNAME | \_\***\*\*\*\*\***.dev.music-player-system-api.com | \_\***\*\*\*\*\***.[key].acm-validations.aws |

  - Wait for that SSL certificate has been issued by the AWS Certificate Manager

## 1. SSH into your EC2 instance:

_Ensure that port 80 and 443 have been opened on your EC2 instance security group_

Use SSH to connect to your EC2 instance.

## 2. Update package lists:

Run the following command to update the package lists on your EC2 instance:

```bash
sudo apt update
```

## 3. Install Nginx:

Run the following command to install Nginx:

```bash
sudo apt install nginx
```

## 4. Start Nginx service:

After installation, start the Nginx service by running:

```bash
sudo systemctl start nginx
```

## 5. Enable Nginx to start on boot (optional):

To ensure Nginx starts automatically whenever your EC2 instance is rebooted, run:
bash

```bash
sudo systemctl enable nginx
```

## 6. Check if Nginx is running on boot (optional):

```bash
sudo service nginx status
```

# Enable SSL

## Use Certbot ( easy but trash )

### 1. Install certbot-nginx:

```
sudo apt-get install software-properties-common
sudo apt install certbot python3-certbot-nginx -y
sudo apt-get update
```

### 2. Enable SSL with certbot-nginx

- `sudo certbot --nginx` ( option to let certbot fully configure it for us)

- Read the certbot requirements and fill in the information you want

### 3. Configure Nginx:

- Edit the Nginx configuration file to set up the reverse proxy:

  ```
  sudo nano /etc/nginx/sites-available/default
  ```

- Add the following configuration: ( example for domain/app1 -> port 3009 and domain/app2 -> port 8080)

**( Only change the location )**

```
server {
    listen 443 ssl;
    server_name dev.music-player-system-api.com;

    ssl_certificate /etc/letsencrypt/live/dev.music-player-system-api.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.music-player-system-api.com/privkey.pem;

    location /app1 {
        proxy_pass http://54.168.193.239:3009;  # Replace with the actual address and port of your first application
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /app2 {
        proxy_pass http://54.168.193.239:8080;  # Replace with the actual address and port of your second application
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Restart Nginx:

```
sudo service restart nginx
```

### 5.Testing

Make sure that your backend applications are running on the specified ports (3009 and 8080 in this example). Access your domain via HTTPS:

- https://dev.music-player-system-api.com/app1 should be proxied to http://54.168.193.239:3009
- https://dev.music-player-system-api.com/app2 should be proxied to http://54.168.193.239:8080

## Use ZeroSSL

### 1. Get free SSL certificate

Can not use certificate from ACM because we can not get the certificate code.

Skip if you already have valid cert files (certificate.crt & private.key)

1. Go to https://www.sslforfree.com/
2. Request new free ssl cert for 90 days
3. You will 3 files: ca_bundle.crt & certificate.crt & private.key
   We will use certificate.crt & private.key in next step

### 2. Save SSL certs on ec2

1. Create new folder in certs

   ```
   sudo mkdir /etc/ssl/certs/dev-music-player-system-api-com/
   sudo chmod 700 /etc/ssl/certs/dev-music-player-system-api-com/
   ```

2. Create our certificate.crt

- Open new file. Past certificate.crt content from step 6. Save & quit Nano by "Ctrl+S" & "Ctrl+X"
  ```
  sudo nano /etc/ssl/certs/dev-music-player-system-api-com/certificate.crt
  ```
- Check the result:
  ```
  sudo cat /etc/ssl/certs/dev-music-player-system-api-com/certificate.crt
  ```

3. Create our private.key

- Open new file. Past certificate.crt content from step 6. Save & quit Nano by "Ctrl+S" & "Ctrl+X"
  ```
  sudo nano /etc/ssl/certs/dev-music-player-system-api-com/private.key
  ```
- Check the result:
  ```
  sudo cat /etc/ssl/certs/dev-music-player-system-api-com/private.key
  ```

## 3. Configure Nginx as a reverse proxy:

Navigate to Nginx's configuration directory:

```bash
cd /etc/nginx/sites-available
```

Create a new configuration file for your reverse proxy set## p. You can name it based on your preference, for example:

```bash
sudo nano reverse_proxy.conf
```

Inside the configuration file, set up Nginx to act as a reverse proxy by adding the following configuration:

```
server {
    listen 443 ssl;
    server_name dev.music-player-system-api.com;

    ssl_certificate /etc/ssl/certs/dev-music-player-system-api-com/certificate.crt;
    ssl_certificate_key /etc/ssl/certs/dev-music-player-system-api-com/private.key;

    location / {
        proxy_pass http://54.168.193.239:3009/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

_Use our proxy_pass (Elastic IP) & ssl_certificate & ssl_certificate_key path on step 7_

## 4. Enable the site:

Create a symbolic link to enable your new configuration:

```bash
sudo ln -s /etc/nginx/sites-available/reverse_proxy.conf /etc/nginx/sites-enabled/
```

## 5. Test Nginx configuration:

Before reloading Nginx, it's a good practice to test the configuration to ensure there are no syntax errors:

```
sudo nginx -t
```

## 6. Reload Nginx:

If the test is successful, reload Nginx to apply the changes:

```
sudo systemctl reload nginx
```

## 7. Test your setup:

Access https://dev.music-player-system-api.com in a web browser to test if Nginx is correctly proxying requests to your application running on http://54.168.193.239:3009/.

That's it!
