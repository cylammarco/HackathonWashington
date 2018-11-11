import numpy as np

filelist = np.loadtxt('/var/www/public/images/filelist.txt', dtype='str')

file0 = filelist[0]
for i in filelist:
    print('sextractor ' + file0 + '[1],' + i + '[1] -c /var/www/public/images/IOO.sex -CATALOG_NAME ' + i[:-4] + 'cat', file=open("/var/www/public/images/sextract.sh", "a+"))

