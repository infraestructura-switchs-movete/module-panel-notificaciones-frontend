FROM nginx:1.21.0

## Raíz para los modulos compilados
RUN mkdir -p /usr/share/nginx/arqmv-module-panel-notificaciones-frontend

## Raíz para el root
RUN echo 'alias ll="ls -lha"' >> ~/.bashrc


COPY ./dist /usr/share/nginx/arqmv-module-panel-notificaciones-frontend

COPY ./default.conf /etc/nginx/conf.d/
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80