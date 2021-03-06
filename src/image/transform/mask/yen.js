// see https://github.com/fiji/Auto_Threshold/blob/master/src/main/java/fiji/threshold/Auto_Threshold.java
// Implements Yen  thresholding method
// 1) Yen J.C., Chang F.J., and Chang S. (1995) "A New Criterion
//    for Automatic Multilevel Thresholding" IEEE Trans. on Image
//    Processing, 4(3): 370-378
// 2) Sezgin M. and Sankur B. (2004) "Survey over Image Thresholding
//    Techniques and Quantitative Performance Evaluation" Journal of
//    Electronic Imaging, 13(1): 146-165
//    http://citeseer.ist.psu.edu/sezgin04survey.html
//
// M. Emre Celebi
// 06.15.2007
// Ported to ImageJ plugin by G.Landini from E Celebi's fourier_0.8 routines

export default function yen(histogram, total) {
    let norm_histo = new Array(histogram.length); // normalized histogram
    for (let ih = 0; ih < histogram.length; ih++)
        norm_histo[ih] = histogram[ih] / total;

    let P1 = new Array(histogram.length); // cumulative normalized histogram
    P1[0] = norm_histo[0];
    for (let ih = 1; ih < histogram.length; ih++)
        P1[ih] = P1[ih - 1] + norm_histo[ih];

    let P1_sq = new Array(histogram.length);
    P1_sq[0] = norm_histo[0] * norm_histo[0];
    for (let ih = 1; ih < histogram.length; ih++)
        P1_sq[ih] = P1_sq[ih - 1] + norm_histo[ih] * norm_histo[ih];

    let P2_sq = new Array(histogram.length);
    P2_sq[histogram.length - 1] = 0.0;
    for (let ih = histogram.length - 2; ih >= 0; ih--)
        P2_sq[ih] = P2_sq[ih + 1] + norm_histo[ih + 1] * norm_histo[ih + 1];

    /* Find the threshold that maximizes the criterion */
    let threshold = -1;
    let max_crit = Number.MIN_VALUE;
    let crit;
    for (let it = 0; it < histogram.length; it++) {
        crit = -1.0 * ((P1_sq[it] * P2_sq[it]) > 0.0 ? Math.log(P1_sq[it] * P2_sq[it]) : 0.0) + 2 * ((P1[it] * (1.0 - P1[it])) > 0.0 ? Math.log(P1[it] * (1.0 - P1[it])) : 0.0);
        if (crit > max_crit) {
            max_crit = crit;
            threshold = it;
        }
    }
    return threshold;
}
