FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base 
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get install -y gnupg2 && \
    wget -qO- https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y build-essential nodejs
	
ENV CHOKIDAR_USEPOLLING=1

WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.1-sdk AS build 
WORKDIR /src
COPY vdn.csproj ./
RUN dotnet restore /vdn.csproj
COPY . .
WORKDIR /src/
RUN dotnet build vdn.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish vdn.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .

RUN npm i
RUN npm rebuild node-sass --force
ENTRYPOINT ["dotnet", "vdn.dll"]
