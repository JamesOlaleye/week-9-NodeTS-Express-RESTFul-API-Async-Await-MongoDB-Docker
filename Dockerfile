FROM node:gallium-alpine 

ENV NODE_ENV=production

ENV PORT=4000

WORKDIR /user/app

COPY ./ ./

RUN yarn 

EXPOSE 8080

CMD ["yarn", "start"]



 

