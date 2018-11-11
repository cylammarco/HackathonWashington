import numpy as np
from matplotlib import pyplot as plt

filelist = np.loadtxt('/var/www/public/images/filelist.txt', dtype='str')

number = []
flux = []
flux_err = []
mag = []
mag_err = []
x_image = []
y_image = []
flag =[]

for i in filelist:
    data = np.loadtxt('/var/www/public/images/' + i[23:-4] + 'cat')
    number.append(data[:,0])
    flux.append(data[:,1])
    flux_err.append(data[:,2])
    mag.append(data[:,3])
    mag_err.append(data[:,4])
    x_image.append(data[:,5])
    y_image.append(data[:,6])
    flag.append(data[:,7])


number = np.array(number).T
mag = np.array(mag).T
mag_err = np.array(mag_err).T
x_image = np.array(x_image).T
y_image = np.array(y_image).T
flag = np.array(flag).T

mag_raw = mag.copy()

mag_mask = (np.max(mag, axis=1) != 99.) & (np.std(mag, axis=1) < 1.0)


number = number[mag_mask]
mag = mag[mag_mask]
mag_err = mag_err[mag_mask]
x_image = x_image[mag_mask]
y_image = y_image[mag_mask]
flag = flag[mag_mask]

x_image = x_image[:,0]
y_image = y_image[:,0]
flag = flag[:,0]


good_source = ( (flag == 0) &
                (np.sqrt((x_image-1000.)**2. + (y_image-1000.)**2.) < 500.) )


weight = 1. / mag_err[good_source]**2.

# length = number of good sources
mean_mag = np.zeros(len(mag[good_source]))
for i in range(len(mag[good_source])):
    mean_mag[i] = np.sum( mag[good_source][i] * weight[i] ) / np.sum(weight[i])


# length = number of epoch
correction = np.zeros(len(mag[0]))
for i in range(len(mag[0])):
    correction[i] = np.sum((mag[good_source][:,i] - mean_mag) * weight[:,i]) / np.sum(weight[:,i])


# find the corrected magnitude for all sources
mag_corr = mag.copy()
for i in range(len(mag)):
    mag_corr[i] = mag[i] - correction



plt.figure(1, figsize=(8,8))
plt.clf()
for i in range(np.sum(good_source)):
    plt.plot(mag_corr[good_source][i], color='grey')


plt.plot(mag_raw[int((number[good_source][33])[0])-1], lw=2, color='C3', label='Raw Photometry')
plt.plot(mag_corr[good_source][33], lw=5, color='C0', label='Ensemble Photometry')
plt.ylim(-10.2,-9.2)
plt.xlim(-1,120)
plt.title('Gaia-DR2-42279142365')
plt.ylabel('Arbitrary magnitude')
plt.xlabel('Frame')
plt.grid()
plt.legend()
plt.savefig('/var/www/public/images/EnsemblePhotometry.png')





